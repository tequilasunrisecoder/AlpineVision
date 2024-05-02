import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const HeaderCart = ({ onCloseAllBoxes }) => {


    const [productsMask, setProductsMask] = useState([]);
    const [productsGlass, setProductsGlass] = useState([]);
    const [imgMask, setImgMask] = useState(''); // Dichiarazione dello stato imgMask e della funzione setImgMask
    const [imgGlass, setImgGlass] = useState(''); // Dichiarazione dello stato imgMask e della funzione setImgMask

    useEffect(() => {
        fetch(`http://localhost:3000/api/products`)
          .then(response => {if (!response.ok) {throw new Error('errore');}return response.json();})
          .then(data => {
            const filteredProducts = data.filter(product => product.type === "prodotto");
            const masks = filteredProducts.filter(product => product.categoria === "maschera");
            const glasses = filteredProducts.filter(product => product.categoria === "occhiale");
            setProductsMask(masks);
            setProductsGlass(glasses);
            const imgMaskValue = `http://localhost:3000/api/products/${masks[0]?._id}/verde/frontale`;
            const imgGlassValue = `http://localhost:3000/api/products/${glasses[0]?._id}/verde/frontale`;

            setImgMask(imgMaskValue);
            setImgGlass(imgGlassValue);

          })
          .catch(error => console.error("Errore nel recupero dei prodotti", error));
      }, []);
      
  
        return (
        <>
            {5 > 0 && ( // Visualizza il badge solo se l'itemCount è maggiore di 0
                <span className="position-absolute top-0 mt-0 start-50 badge m-0 p-0 p-1 rounded-pill bg-danger">
                    {500}
                    <span className="visually-hidden">elementi nel carrello</span>
                </span>
            )}
      </>
    );
}

export default HeaderCart;
