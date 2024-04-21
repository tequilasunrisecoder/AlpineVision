import React, { useEffect, useState } from 'react';
import { Container, Row, Form, Col, Carousel, Button,Tabs,Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './Product.css';

import Immagine3 from '../../assets/Images/maskL.png';

const importAll = (r) => r.keys().map(r);

// Importa immagini dai set specificati
const imagesSet1 = importAll(require.context('../../assets/Images/products/EternalAura/color1', false, /\.(png|jpe?g|svg)$/));
const imagesSet2 = importAll(require.context('../../assets/Images/products/EternalAura/color2', false, /\.(png|jpe?g|svg)$/));
const imagesSet3 = importAll(require.context('../../assets/Images/products/EternalAura/color2', false, /\.(png|jpe?g|svg)$/));
const imagesSet4 = importAll(require.context('../../assets/Images/products/EternalAura/color2', false, /\.(png|jpe?g|svg)$/));

export const Product = () => {
    const { id } = useParams();
    const [key, setKey] = useState('vetrina');
    const [product, setProduct] = useState([]);

    const [activeIndex, setActiveIndex] = useState(0);  // Indice per il carosello
    const [selectedSetIndex, setSelectedSetIndex] = useState(0);  // Indice per selezionare il set di immagini

    useEffect(() => {
        console.log(`Caricamento dei dettagli per il post con ID: ${id}`);
      
        fetch(`http://localhost:3000/api/products/${id}/variants`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP status ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Post ricevuto:', data);
            setProduct(data);
          })
          .catch(error => {
            console.error("Errore nel recupero dell'articolo:", error);
          });
      }, [id]);

    const imageSets = [imagesSet1, imagesSet2,imagesSet3,imagesSet4];

    const handleRadioChange = (event) => {
        const newSetIndex = Number(event.target.value);
        setSelectedSetIndex(newSetIndex);
        setActiveIndex(0);  // Resetta l'indice del carosello
    };

    return (
        <Container fluid className="p-0">
            <Row className="d-flex align-items-center pt-5">
                <Col lg={6} className="d-flex flex-column">
                    <Carousel activeIndex={activeIndex} onSelect={(selectedIndex, e) => setActiveIndex(selectedIndex)}>
                        {imageSets[selectedSetIndex].map((imageSrc, idx) => (
                            <Carousel.Item key={idx}>
                                <img
                                    className="d-block w-100"
                                    src={imageSrc.default || imageSrc}
                                    alt={`Set ${selectedSetIndex + 1} - Immagine ${idx + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
                <Col lg={6}  className="white-panel d-flex flex-column justify-content-center">
                    <div className="shadow-box mx-auto">
                        <Row>
                            <h2 className="text-left text-black">{product.nome}</h2>
                        </Row>
                        <Row>
                            <h4 key={product}className="text-left text-black">{product[selectedSetIndex]?.colore ?? ''}</h4>
                        </Row>
                        <Row>
                            <p className="text-left text-black">{product.descrizione || 'Descrizione prodotto'}</p>
                        </Row>
                        <Row>
                            <div className="d-flex align-items-left m-0 p-0">
                            {product.map((item, index) => (
                                    <Form.Check 
                                        key={index}
                                        type="radio"
                                        id={`radio-${index}`}
                                        name="image-radio"
                                        className="image-radio-button m-0 p-0"
                                        onChange={handleRadioChange}
                                        checked={selectedSetIndex === index}
                                        value={index}
                                        label={<label htmlFor={`radio-${index}`} className={`image-radio-label ${selectedSetIndex === index ? 'selected' : ''}`} style={{ backgroundImage: `url(${Immagine3})` }}></label>}
                                    />
                                ))}
                            </div>
                        </Row>
                        <Row className="justify-content-center m-0">
                            <Col xs={12} className="d-flex justify-content-left align-items-center pb-5">
                                <Button variant="outline-dark" size="lg">Aggiungi al carrello</Button>
                                <div style={{ width: '10px' }}></div>
                                <Button href="/EternalAura" variant="outline-dark" size="lg">Compra ora</Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <div style={{ backgroundColor: 'white', height: '50px' }}></div>
            <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-0 justify-content-center dark p-0"
      //justify
    >
      <Tab eventKey="vetrina" title="Vetrina" className='dark p-0'>
      <Row className="m-0 p-0 no-space-row bg-black">
                <div style={{ backgroundColor: 'black', height: '50px' }}></div>
                <Col className="text-center bg-black text-white p-3">
                    <h2>Dai un'occhiata da vicino.</h2>
                    <div style={{ backgroundColor: 'black', height: '50px' }}></div>
                </Col>
            </Row>
      </Tab>
      <Tab eventKey="caratteristiche" title="Caratteristiche">
      <div style={{ backgroundColor: 'red', height: '150px' }}></div>

      </Tab>
     
    </Tabs>






            
        </Container>
    );
};
