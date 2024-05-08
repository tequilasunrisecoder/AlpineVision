
export async function GetAllProducts() {
    try {
        const response = await fetch(`http://localhost:3000/api/products`);
        if (!response.ok) {
            throw new Error('Errore nella richiesta dei prodotti');
        }
        const data = await response.json();

        // Funzione per ottenere le immagini del prodotto (frontale e laterale)
        const getImageUrls = async (id) => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${id}/variants`);
                if (!response.ok) {
                    throw new Error('Errore durante la richiesta');
                }
                const data2 = await response.json();
        
                // Verifica che data2 contenga almeno un elemento
                if (data2.length > 0) {
                    const colore = data2[0].colore;
                    const frontRes = await fetch(`http://localhost:3000/api/products/${id}/${colore}/frontale`);
                    const sideRes = await fetch(`http://localhost:3000/api/products/${id}/${colore}/sinistra`);
                    const frontUrl = frontRes.ok ? await frontRes.url : '';
                    const sideUrl = sideRes.ok ? await sideRes.url : '';
                    const color = colore;
                    const variants = data2;
        
                    return { frontUrl, sideUrl, color, variants };
                } else {
                    console.error("No variants found for product", id);
                    return { frontUrl: '', sideUrl: '', color: '', variants: [] };
                }
            } catch (error) {
                console.error("Error fetching images for product", id, error);
                return { frontUrl: '', sideUrl: '', color: '', variants: [] };
            }
        };
        

        // Ottieni le immagini per tutti i prodotti
        const imageFetchPromises = data.map(product => getImageUrls(product._id));
        const images = await Promise.all(imageFetchPromises);

        // Costruisci i prodotti con le immagini corrispondenti
        const productsWithImages = data.map((product, index) => ({
            ...product,
            color: images[index].color,
            imageUrlFront: images[index].frontUrl,
            imageUrlSide: images[index].sideUrl,
            variants:images[index].variants
        }));

        // Filtra per categoria
        const masks = productsWithImages.filter(product => product.categoria === "maschera");
        const glasses = productsWithImages.filter(product => product.categoria !== "maschera");

        return { masks, glasses };
    } catch (error) {
        console.error("Errore nel recupero dei prodotti", error);
        return { masks: [], glasses: [] }; // Ritorna oggetti vuoti in caso di errore
    }
}

export async function GetAllAccessory() {
    try {
        const response = await fetch(`http://localhost:3000/api/accessories`);
        if (!response.ok) {
            throw new Error('Errore nella richiesta dei prodotti');
        }
        const data = await response.json();

        // Funzione per ottenere le immagini del prodotto (frontale e laterale)
        const getImageUrls = async (id) => {
            try {
                const frontRes = await fetch(`http://localhost:3000/api/accessories/${id}/image1`);
                const sideRes = await fetch(`http://localhost:3000/api/accessories/${id}/image2`);
                const frontUrl = frontRes.ok ? await frontRes.url : '';
                const sideUrl = sideRes.ok ? await sideRes.url : '';
                return { frontUrl, sideUrl };
            } catch (error) {
                console.error("Error fetching images for product", id, error);
                return { frontUrl: '', sideUrl: '' };
            }
        };

        // Ottieni le immagini per tutti i prodotti
        const imageFetchPromises = data.map(product => getImageUrls(product._id));
        const images = await Promise.all(imageFetchPromises);

        // Costruisci i prodotti con le immagini corrispondenti
        const productsWithImages = data.map((product, index) => ({
            ...product,
            color: null,
            imageUrlFront: images[index].frontUrl,
            imageUrlSide: images[index].sideUrl
        }));

        // Filtra per categoria
        const accessory = productsWithImages;

        return { accessory };
    } catch (error) {
        console.error("Errore nel recupero dei prodotti", error);
        return { accessory: []}; // Ritorna oggetti vuoti in caso di errore
    }
}


export async function GetAllProductVariants(ProdId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${ProdId}/variants`);
        if (!response.ok) {
            throw new Error('Errore nella richiesta dei prodotti');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errore nel recupero dei prodotti", error);
        return []; // Ritorna oggetti vuoti in caso di errore
    }
}

/* SALVATAGGIO */


export async function saveAll(allElements, originalElements) {
    console.log("salvataggio")
   // console.log(allElements,originalElements)

    // Filtra gli elementi che sono stati aggiunti o modificati rispetto agli originali
    const addedOrModifiedElements = allElements.filter(element => {
        // Trova l'elemento corrispondente nell'array originalElements
        const originalElement = originalElements.find(originalElement => originalElement._id === element._id);
        // Se non trova un corrispondente originale o se l'elemento è stato modificato, restituisci true
        //return !originalElement;
        return !originalElements.some(originalElement => originalElement._id === element._id);

    });
    console.log("addedOrModifiedElements",addedOrModifiedElements)

    // Filtra gli elementi che sono stati rimossi rispetto agli originali
    const removedElements = originalElements.filter(originalElement => {
        // Trova l'elemento corrispondente nell'array allElements
        return !allElements.some(element => element._id === originalElement._id);
    });

    // Aggiungi o modifica i prodotti nell'archivio
    await Promise.all(addedOrModifiedElements.map(async element => {
        // Se l'elemento è nuovo, aggiungilo all'archivio
        console.log("Agg")

        if (!originalElements.some(originalElement => originalElement._id === element._id)) {
            await addProduct(element);
            console.log("Aggingo...")

        }

        // Controlla le varianti del prodotto e aggiungi o elimina le varianti necessarie
       // await handleVariants(element, originalElements);
    }));

    // Rimuovi i prodotti dall'archivio
    await Promise.all(removedElements.map(async element => {
        await deleteProduct(element._id);
    }));
}
async function handleVariants(product,originalElements) {
    // Se il prodotto ha varianti, gestiscile
    if (product.variants && product.variants.length > 0) {
        // Filtra le varianti che sono state aggiunte o modificate rispetto alle varianti originali
        const addedOrModifiedVariants = product.variants.filter(variant => {
            // Trova la variante corrispondente nell'array originalVariants
            const originalVariant = originalElements
                .find(originalElement => originalElement._id === product._id)
                .variants.find(originalVariant => originalVariant._id === variant._id);

            // Se non trova un corrispondente originale o se la variante è stata modificata, restituisci true
            return !originalVariant || JSON.stringify(originalVariant) !== JSON.stringify(variant);
        });

        // Filtra le varianti che sono state rimosse rispetto alle varianti originali
        const removedVariants = originalElements
            .find(originalElement => originalElement._id === product._id)
            .variants.filter(originalVariant => !product.variants.some(variant => variant._id === originalVariant._id));

        // Aggiungi o modifica le varianti
        await Promise.all(addedOrModifiedVariants.map(async variant => {
            await addVariant(product._id, variant);
        }));

        // Rimuovi le varianti
        await Promise.all(removedVariants.map(async variant => {
            await deleteVariant(product._id, variant._id);
        }));
    }
}



/*async function addProduct(product) {
    try {
        const prod = {
            nome: product.nome,
            prezzo: product.prezzo,
            descrizione: product.descrizione,
            categoria: 'maschera'
        };

        // Step 1: Aggiungi il prodotto principale
        const productResponse = await fetch('http://localhost:3000/api/products/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prod)
        });

        if (!productResponse.ok) {
            throw new Error('Errore durante l\'aggiunta del prodotto principale');
        }

        const { _id } = await productResponse.json();

        // Step 2: Aggiungi le varianti del prodotto
        const variantsResponses = await Promise.all(product.variants.map(async (variant) => {
            const varia = {
                colore: variant.colore,
                quantita: variant.quantita,
                productId: _id
            };

            const variantResponse = await fetch(`http://localhost:3000/api/products/${_id}/variants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(varia)
            });

            if (!variantResponse.ok) {
                console.log([varia])
                throw new Error('Errore durante l\'aggiunta di una variante del prodotto',variantResponse);
            }

            const variantData = await variantResponse.json();

            //
            const formData = new FormData();

            console.log("Immagini",variant)
            console.log("Immagineee",variant.immagini[0])

            formData.append('fileB', variant.immagini[0]);
            formData.append('fileF', variant.immagini[1]);
            formData.append('fileS', variant.immagini[2]);
            formData.append('fileD', variant.immagini[3]);

            const variantImageResponse = await fetch(`http://localhost:3000/api/products/${_id}/${variant.colore}`, {
        method: 'POST',
        body: formData
    });

    if (!variantImageResponse.ok) {
        throw new Error('Errore durante l\'aggiunta delle immagini della variante del prodotto');
    }

    const variantImageData = await variantImageResponse.json();

    return { variantData, variantImageData };
        }));

       
        return { productId: _id, variantIds: variantsResponses.map(response => response._id) };
    } catch (error) {
        console.error('Si è verificato un errore durante l\'aggiunta del prodotto con le varianti:', error);
        throw error;
    }
}
*/
async function addProduct(product) {
    try {
        const prod = {
            nome: product.nome,
            prezzo: product.prezzo,
            descrizione: product.descrizione,
            categoria: 'maschera'
        };

        // Step 1: Aggiungi il prodotto principale
        const productResponse = await fetch('http://localhost:3000/api/products/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prod)
        });

        if (!productResponse.ok) {
            throw new Error('Errore durante l\'aggiunta del prodotto principale');
        }

        const { _id } = await productResponse.json();

        // Step 2: Aggiungi le varianti del prodotto
        const variantsResponses = await Promise.all(product.variants.map(async (variant) => {
            const varia = {
                colore: variant.colore,
                quantita: variant.quantita,
                productId: _id
            };

            const variantResponse = await fetch(`http://localhost:3000/api/products/${_id}/variants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(varia)
            });

            if (!variantResponse.ok) {
                throw new Error('Errore durante l\'aggiunta di una variante del prodotto');
            }

            const variantData = await variantResponse.json();

            const formData = new FormData();

            formData.append('fileB', variant.immagini[0], variant.immagini[0].name);
            formData.append('fileF', variant.immagini[1]);
            formData.append('fileS', variant.immagini[2]);
            formData.append('fileD', variant.immagini[3]);
            console.log("formData",formData)
            console.log("Dati",variant.immagini)
            console.log("Dato",variant.immagini[0])

            const variantImageResponse = await fetch(`http://localhost:3000/api/products/${_id}/${variant.colore}`, {
                method: 'POST',
                body: formData
            });

            if (!variantImageResponse.ok) {
                throw new Error('Errore durante l\'aggiunta delle immagini della variante del prodotto');
            }

            const variantImageData = await variantImageResponse.json();

            // Restituisci i dati della variante e dell'immagine della variante come oggetto
            return { variantData, variantImageData };
        }));

        // Restituisci l'ID del prodotto principale e gli ID delle varianti aggiunte
        return { productId: _id, variantIds: variantsResponses.map(response => response.variantData._id) };
    } catch (error) {
        console.error('Si è verificato un errore durante l\'aggiunta del prodotto con le varianti:', error);
        throw error;
    }
}




// Funzione per eliminare un prodotto
async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Prodotto con ID ${productId} eliminato con successo.`);
        } else {
            console.error(`Si è verificato un problema durante l'eliminazione del prodotto con ID ${productId}.`);
        }
    } catch (error) {
        console.error('Si è verificato un errore durante la richiesta di eliminazione del prodotto:', error);
    }
}


// Funzione per aggiungere una variante a un prodotto
async function addVariant(productId, variant) {
    // Implementa l'aggiunta della variante al prodotto nell'archivio (ad esempio, inviando i dati al server)
    console.log("Aggiungi la variante al prodotto con ID:", productId, variant);
}

// Funzione per eliminare una variante di un prodotto
async function deleteVariant(productId, variantId) {
    // Implementa l'eliminazione della variante dal prodotto nell'archivio (ad esempio, inviando i dati al server)
    console.log("Elimina la variante dal prodotto con ID:", productId, "e ID variante:", variantId);
}