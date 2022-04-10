import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { useProduct } from "../../hooks";
import { getProductsCart } from "../../api/cart";
import { ListProductsCart } from "../../components/Client";
import { size } from "lodash";

export function Cart() {
  const [products, setProducts] = useState(null);
  const [reloadCart, setReloadCart] = useState(false);
  const { getProduct } = useProduct();
  const { tableNumber } = useParams();

  useEffect(() => {
    (async () => {
      const idProductsCart = getProductsCart();

      const productsArray = [];
      for await (const idProduct of idProductsCart) {
        const response = await getProduct(idProduct);
        productsArray.push(response);
      }
      setProducts(productsArray);
    })();
  }, [reloadCart]);

  const onReloadCart = () => setReloadCart((prev) => !prev);

  return (
    <div>
      <h1>Carrito</h1>
      {!products ? (
        <p>Cargando...</p>
      ) : size(products) < 1 ? (
        <div style={{ textAlign: "center" }} className="card-no-products">
          <p>Tu carrito esta vacio</p>
          <Link to={`/client/${tableNumber}/orders`}>
            <Button primary>Ver pedidos</Button>
          </Link>
        </div>
      ) : (
        <ListProductsCart products={products} onReloadCart={onReloadCart} />
      )}
    </div>
  );
}
