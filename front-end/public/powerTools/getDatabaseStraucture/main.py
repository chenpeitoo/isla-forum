import mysql.connector
from mysql.connector import Error
import os

def get_db_credentials():
    """提示使用者輸入資料庫連線資訊"""
    print("請輸入您的 MySQL 資料庫連線資訊：")
    db_host = "localhost"
    db_user = input("資料庫使用者名稱: ")
    db_password = input("資料庫密碼: ")
    db_name = input("資料庫名稱: ")
    return db_host, db_user, db_password, db_name

def create_connection(host_name, user_name, user_password, db_name):
    """建立資料庫連線"""
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print(f"成功連接到資料庫 '{db_name}'。")
    except Error as e:
        print(f"資料庫連線錯誤: {e}")
    return connection

def get_table_names(connection):
    """獲取資料庫中所有資料表的名稱"""
    cursor = connection.cursor()
    cursor.execute("SHOW TABLES;")
    tables = [table[0] for table in cursor.fetchall()]
    cursor.close()
    return tables

def get_table_columns(connection, table_name):
    """獲取資料表欄位資訊"""
    cursor = connection.cursor(dictionary=True)
    cursor.execute(f"DESCRIBE `{table_name}`;")
    columns = cursor.fetchall()
    cursor.close()
    return columns

def get_primary_key(connection, db_name, table_name):
    """獲取資料表主鍵資訊"""
    cursor = connection.cursor(dictionary=True)
    query = """
    SELECT k.COLUMN_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
    JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS k
    USING (CONSTRAINT_NAME, TABLE_SCHEMA, TABLE_NAME)
    WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
      AND tc.TABLE_SCHEMA = %s
      AND tc.TABLE_NAME = %s;
    """
    cursor.execute(query, (db_name, table_name))
    pk_columns = [row['COLUMN_NAME'] for row in cursor.fetchall()]
    cursor.close()
    return pk_columns

def get_foreign_keys(connection, db_name, table_name):
    """獲取資料表外鍵資訊"""
    cursor = connection.cursor(dictionary=True)
    query = """
    SELECT
        kcu.CONSTRAINT_NAME,
        kcu.COLUMN_NAME,
        kcu.REFERENCED_TABLE_NAME,
        kcu.REFERENCED_COLUMN_NAME,
        rc.UPDATE_RULE,
        rc.DELETE_RULE
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
    JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS rc
      ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME AND kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
    WHERE kcu.TABLE_SCHEMA = %s
      AND kcu.TABLE_NAME = %s
      AND kcu.REFERENCED_TABLE_NAME IS NOT NULL;
    """
    cursor.execute(query, (db_name, table_name))
    foreign_keys = cursor.fetchall()
    cursor.close()
    return foreign_keys

def get_indexes(connection, table_name):
    """獲取資料表索引資訊"""
    cursor = connection.cursor(dictionary=True)
    # SHOW INDEX FROM table_name;
    # 欄位: Table, Non_unique, Key_name, Seq_in_index, Column_name, Collation, Cardinality, Sub_part, Packed, Null, Index_type, Comment, Index_comment
    try:
        cursor.execute(f"SHOW INDEX FROM `{table_name}`;")
        indexes_raw = cursor.fetchall()
        # 將相同索引的欄位組合起來
        indexes = {}
        for idx in indexes_raw:
            key_name = idx['Key_name']
            if key_name not in indexes:
                indexes[key_name] = {
                    'columns': [],
                    'is_unique': not bool(idx['Non_unique']),
                    'type': idx['Index_type']
                }
            indexes[key_name]['columns'].append(idx['Column_name'])
        return indexes
    except Error as e:
        print(f"獲取資料表 '{table_name}' 的索引時發生錯誤: {e}")
        return {}
    finally:
        cursor.close()


def get_create_table_statement(connection, table_name):
    """獲取 CREATE TABLE 語句"""
    cursor = connection.cursor()
    try:
        cursor.execute(f"SHOW CREATE TABLE `{table_name}`;")
        result = cursor.fetchone()
        return result[1] if result else "" # result[1] 是 CREATE TABLE 語句
    except Error as e:
        print(f"獲取資料表 '{table_name}' 的 CREATE TABLE 語句時發生錯誤: {e}")
        return ""
    finally:
        cursor.close()

def generate_markdown_documentation(connection, db_name, output_filename="database_schema_documentation.md"):
    """產生 Markdown 格式的資料庫說明文件"""
    table_names = get_table_names(connection)
    if not table_names:
        print("在資料庫中找不到任何資料表。")
        return

    with open(output_filename, 'w', encoding='utf-8') as md_file:
        md_file.write(f"# 資料庫結構說明: {db_name}\n\n")

        for table_name in table_names:
            print(f"正在處理資料表: {table_name}...")
            md_file.write(f"## 資料表: `{table_name}`\n\n")

            # 欄位資訊
            columns = get_table_columns(connection, table_name)
            md_file.write("**欄位 (Columns):**\n\n")
            md_file.write("| 欄位名稱 | 資料型態 | 可否為空 | 預設值 | 額外資訊 (例如 auto_increment) |\n")
            md_file.write("|------------|------------|----------|--------------|--------------------------------|\n")
            for col in columns:
                nullable = "YES" if col['Null'] == 'YES' else "NO"
                default_value = col['Default'] if col['Default'] is not None else "NULL"
                extra = col['Extra'] if col['Extra'] else ""
                md_file.write(f"| `{col['Field']}` | {col['Type']} | {nullable} | {default_value} | {extra} |\n")
            md_file.write("\n")

            # 主鍵資訊
            pk_columns = get_primary_key(connection, db_name, table_name)
            md_file.write("**主鍵 (Primary Key):**\n")
            if pk_columns:
                md_file.write(f"* `{'`, `'.join(pk_columns)}`\n\n")
            else:
                md_file.write("* (無主鍵)\n\n")

            # 外鍵資訊
            foreign_keys = get_foreign_keys(connection, db_name, table_name)
            md_file.write("**外鍵 (Foreign Keys):**\n\n")
            if foreign_keys:
                md_file.write("| 約束名稱 | 本表欄位 | 參照資料表 | 參照欄位 | ON DELETE | ON UPDATE |\n")
                md_file.write("|----------------|------------|--------------------|-----------------|-----------|-----------|\n")
                for fk in foreign_keys:
                    md_file.write(f"| `{fk['CONSTRAINT_NAME']}` | `{fk['COLUMN_NAME']}` | `{fk['REFERENCED_TABLE_NAME']}` | `{fk['REFERENCED_COLUMN_NAME']}` | {fk['DELETE_RULE']} | {fk['UPDATE_RULE']} |\n")
                md_file.write("\n")
            else:
                md_file.write("* (無外鍵)\n\n")

            # 索引資訊
            indexes = get_indexes(connection, table_name)
            md_file.write("**索引 (Indexes):**\n\n")
            if indexes:
                md_file.write("| 索引名稱 | 欄位 (依序) | 是否唯一 | 類型 |\n")
                md_file.write("|--------------|-----------------|----------|-------|\n")
                for index_name, idx_details in indexes.items():
                    columns_str = ", ".join([f"`{c}`" for c in idx_details['columns']])
                    unique_str = "YES" if idx_details['is_unique'] else "NO"
                    md_file.write(f"| `{index_name}` | {columns_str} | {unique_str} | {idx_details['type']} |\n")
                md_file.write("\n")
            else:
                md_file.write("* (除了主鍵外無其他索引)\n\n")

            # CREATE TABLE 語句
            create_statement = get_create_table_statement(connection, table_name)
            md_file.write("**`CREATE TABLE` 語句:**\n")
            md_file.write("```sql\n")
            md_file.write(create_statement + "\n")
            md_file.write("```\n\n")

            md_file.write("---\n\n") # 分隔線

        print(f"資料庫結構說明文件已成功產生於 '{output_filename}'")

if __name__ == "__main__":
    db_host, db_user, db_password, db_name = get_db_credentials()
    
    conn = create_connection(db_host, db_user, db_password, db_name)

    if conn and conn.is_connected():
        output_file = f"{db_name}_schema_documentation.md"
        generate_markdown_documentation(conn, db_name, output_file)
        conn.close()
        print("資料庫連線已關閉。")
    else:
        print("無法產生文件，因為資料庫連線失敗。")

