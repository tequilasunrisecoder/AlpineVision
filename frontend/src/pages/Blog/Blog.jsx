import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Blog.css';

export const Blog = () => {

  const [blogPosts, setBlogPosts] = useState([]); // Variabile per salvare i vari post

  // Funzione per ottenere l'URL dell'immagine di copertina del post
  const getImageById = (id) => {
     return `http://localhost:3000/api/posts/photo-copertina?id=${id}`;
  };

  // Caricamento dei post del blog dal backend
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts/getAllPosts');
        if (!response.ok) {
          throw new Error('Errore durante il recupero dei post del blog');
        }
        const data = await response.json();
        console.log(data);
        setBlogPosts(data);
      } catch (error) {console.error("Errore nel recuperare i post del blog:", error);}
    };
  
    fetchBlogPosts();
  
  }, []);

    
  return (
    <Container fluid className="p-0 m-0 ">
      <Row className='mt-1 m-0 p-0 w-100 d-flex flex-grow-1 m-0 p-0'>
        {blogPosts.sort((a, b) => a.position - b.position).map((post, position) => {
          if (position === 1000) {
            // Primo post, occupa tutta la larghezza
            return (
              <Col key={position} md={12}>
                <Card className='m-3 card card-blog'>
                  <Row>
                    <Col lg={4}>
                      {/* Immagine del post */}
                      <Card.Img src={getImageById(post._id)} style={{ width: '100%', height: 'auto' }} />
                    </Col>
                    <Col lg={8}>
                      {/* Dettagli del post */}
                      <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.description}</Card.Text>
                        {/* Link per leggere di più sul post */}
                        <Button as={Link} to={`/BlogArticle/${post._id}`} variant="primary" className="mt-3">Leggi di più</Button>
                      </Card.Body>         
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          } else {
            // Altri post, disposti in colonne di un terzo della larghezza
            return (
              <Col key={position} md={12} lg={4} className='m-0 p-0 d-flex '>
                <Card as={Link} to={`/BlogArticle/${post._id}`} className='card-blog m-0 p-0 '>
                  {/* Immagine del post */}
                  <div className="zoom-image">
        <Card.Img className='zoom-image m-0 p-0  img-car-blog' variant="top" src={getImageById(post._id)} />

      </div>                  
      <Card.Title className='centered-text centered-text-blog'><h2>{post.title}</h2></Card.Title>

{/* Dettagli del post */}
                  {/*<Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    {/*<Card.Text>{post.description}</Card.Text>*/}
                    {/* Link per leggere di più sul post */}
                   {/* <Button as={Link} to={`/BlogArticle/${post._id}`}>Leggi di più</Button>
                  </Card.Body>*/}
                  {/* Footer del post */}
                  {/*<Card.Footer>
                    <small className="text-muted">
                      By {post.author} | {post.date}
                    </small>
                  </Card.Footer>*/}
                </Card>
              </Col>
            );
          }
        })}
      </Row>
    </Container>
  );
};
