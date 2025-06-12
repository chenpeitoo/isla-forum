import Accordion from 'react-bootstrap/Accordion'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

function ProductInfoAccordion({ ingredients, usage }) {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>產品成分</Accordion.Header>
        <Accordion.Body className="text-wrap">
          {ingredients.map((ing, idx) => {
            const isLast = idx === ingredients.length - 1
            const displayText = ing.name + (isLast ? '' : ', ')

            if (ing.is_sensitive) {
              return (
                <OverlayTrigger
                  key={ing.ingredient_id}
                  placement="bottom"
                  overlay={
                    <Tooltip>
                       {ing.warning_message || '本成分可能引起敏感反應'}
                    </Tooltip>
                  }
                >
                  <span
                    className="text-danger fw-semibold"
                  >
                    {displayText}
                  </span>
                </OverlayTrigger>
              )
            }

            return (
              <span key={ing.ingredient_id} className="text-body">
                {displayText}
              </span>
            )
          })}
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header>使用方式</Accordion.Header>
        <Accordion.Body>{usage?.trim() ? usage : '（ 請依照產品包裝上的指示使用！ ）'} 使用彩妝前，記得先把臉洗乾淨並擦上保濕產品，讓皮膚保持水嫩。接著可以用妝前乳或隔離霜，幫助妝容更服貼又持久。上妝的時候，建議每次取少量產品慢慢推開，這樣妝感會比較自然不厚重。眼影、腮紅和唇膏分區上色，讓整體妝容更有層次感。如果想要顏色更鮮明，可以分幾次薄擦，避免一次用太多。最後用定妝噴霧或蜜粉固定妝容，讓妝持久一整天。別忘了，回家一定要好好卸妝，給皮膚一個清爽的休息時間。</Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default ProductInfoAccordion
