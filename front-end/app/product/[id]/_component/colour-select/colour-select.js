import Select, { components } from 'react-select'
import PropTypes from 'prop-types'
import './colour-select.css'

const CustomControl = ({ children, ...props }) => {
    return (
        <components.Control {...props}>
            <div className="color-select-control d-flex align-items-center">
                {children}
            </div>
        </components.Control>
    )
}


const ColourOption = (props) => {
  const { data, innerRef, innerProps } = props
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="color-select d-flex align-items-center"
    >
      <div
        className="color-circle"
        style={{ backgroundColor: data.color_code || '#ccc' }}
      />
      <div className="color-name">{data.label}</div>
    </div>
  )
}

const ColourSingleValue = (props) => {
  const { data } = props
  return (
    <div className="color-select d-flex align-items-center">
      <div
        className="color-circle"
        style={{ backgroundColor: data.color_code || '#ccc' }}
      />
      <div className="color-name">{data.label}</div>
    </div>
  )
}

const ColorSelect = ({ colors, selectedColorId, onChange }) => {
  const options = colors.map((color) => ({
    value: color.color_id,
    label: color.color_name,
    color_code: color.color_code,
  }))

  const selectedOption = options.find((opt) => opt.value === selectedColorId)

  return (
    <div className="color-select-box d-flex align-items-center">
      <label className="me-2">顏色</label>
      <div className="flex-grow-1">
        <Select
          isSearchable={false}
          options={options}
          value={selectedOption}
          onChange={(selected) => onChange(selected.value)}
          components={{
              Control: CustomControl,
              Option: ColourOption,
              SingleValue: ColourSingleValue,
          }}
          classNamePrefix="react-select"
          className="color-select-main"
          styles={{
              control: (base) => ({ ...base, minHeight: 40 }),
              valueContainer: (base) => ({ ...base, padding: '0 8px' }),
              input: (base) => ({ ...base, margin: 0, padding: 0 }),
              indicatorsContainer: (base) => ({ ...base, padding: '0 4px' }),
              dropdownIndicator: (base) => ({ ...base, padding: 4 }),
          }}
        />
      </div>
    </div>
  )
}

ColorSelect.propTypes = {
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      color_id: PropTypes.number.isRequired,
      color_name: PropTypes.string.isRequired,
      color_code: PropTypes.string,
    })
  ).isRequired,
  selectedColorId: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}

export default ColorSelect
