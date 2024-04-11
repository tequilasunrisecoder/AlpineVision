import React, { useState } from 'react';
import { Container, Row, Form, Col, Carousel, Button } from 'react-bootstrap';
import './EternalAura.css';
import { Visualizzazione3D } from './Modello3D.js';

import Immagine3 from '../../../assets/Images/maskL.png';

const importAll = (r) => r.keys().map(r);

// Importa immagini dai set specificati
const imagesSet1 = importAll(require.context('../../../assets/Images/products/EternalAura/color1', false, /\.(png|jpe?g|svg)$/));
const imagesSet2 = importAll(require.context('../../../assets/Images/products/EternalAura/color2', false, /\.(png|jpe?g|svg)$/));

export const EternalAura = () => {
    const [activeIndex, setActiveIndex] = useState(0);  // Indice per il carosello
    const [selectedSetIndex, setSelectedSetIndex] = useState(0);  // Indice per selezionare il set di immagini

    // Array che contiene i due set di immagini
    const imageSets = [imagesSet1, imagesSet2];

    const handleRadioChange = (event) => {
        const newSetIndex = Number(event.target.value);
        setSelectedSetIndex(newSetIndex);
        setActiveIndex(0);  // Resetta l'indice del carosello
    };

    return (
        <Container fluid className="p-0">
            <Row  className="d-flex align-items-stretch pt-5">
                <Col md={6} className="d-flex flex-column">
                    <Carousel activeIndex={activeIndex} onSelect={(selectedIndex, e) => setActiveIndex(selectedIndex)}>
                        {imageSets[selectedSetIndex].map((imageSrc, idx) => (
                            <Carousel.Item key={idx}>
                                <img
                                    className="d-block w-100"
                                    src={imageSrc.default || imageSrc}  // Gestisce sia il caso modulo che non modulo
                                    alt={`Set ${selectedSetIndex + 1} - Immagine ${idx + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
                <Col md={6} className="white-panel d-flex flex-column justify-content-center">
                    <div className="shadow-box mx-auto">
                        <Row>
                            <h2 className="text-left text-black">ETERNAL AURA</h2>
                        </Row>
                        <Row>
                            <h4 className="text-left text-black">black</h4>
                        </Row>
                        <Row>
                            <div className="d-flex align-items-left m-0 p-0">
                                {[Immagine3, Immagine3].map((_, index) => (
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
            <Row className="m-0 no-space-row">
                <div style={{ backgroundColor: 'black', height: '50px' }}></div>
                <Col className="text-center bg-black text-white p-3">
                    <h2>Dai un'occhiata da vicino.</h2>
                    <Visualizzazione3D modelPath={process.env.PUBLIC_URL + '/3d-objects/ProjMask.glb'} />

                    <div style={{ backgroundColor: 'black', height: '50px' }}></div>
                </Col>
            </Row>
        </Container>
    );
};