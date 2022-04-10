import React, { useState, useEffect } from "react";
import { Image, Button, Icon } from "semantic-ui-react";
import { map, forEach } from "lodash";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { removeProductCart, cleanProductCart } from "../../../api/cart";
import "./ListProductsCart.scss";
import { useOrder, useTable } from "../../../hooks";

export function ListProductsCart(props) {
  const { products, onReloadCart } = props;
  const { tableNumber } = useParams();
  const location = useLocation();
  let navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const { addOrder } = useOrder();
  const { getTableByNumber } = useTable();

  useEffect(() => {
    let totalTemp = 0;
    forEach(products, (product) => {
      totalTemp += Number(product.price);
    });
    setTotal(totalTemp.toFixed(2));
  }, [products]);

  const removeProduct = (index) => {
    removeProductCart(index);
    onReloadCart();
  };

  const createOrder = async () => {
    const tableData = await getTableByNumber(tableNumber);
    const idTable = tableData[0].id;

    for await (const product of products) {
      await addOrder(idTable, product.id);
    }

    cleanProductCart();

    navigate(`/client/${tableNumber}/orders`);
  };

  return (
    <div className="list-products-cart">
      {map(products, (product, index) => (
        <div key={index} className="list-products-cart__product">
          <div>
            <Image src={product.image} avatar />
            <span>{product.title.substring(0, 18)}</span>
          </div>
          <span>${product.price}</span>
          <Icon name="close" onClick={() => removeProduct(index)} />
        </div>
      ))}
      <Button primary fluid onClick={createOrder}>
        Realizar pedido (${total})
      </Button>
    </div>
  );
}
