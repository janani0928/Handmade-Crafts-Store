// src/components/ProductList.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import API from "../config/api";


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        axios.get(`${API}/api/products/`)
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

   

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Available Products</h2>
            <div style={styles.productGrid}>
                {products.map(prod => (
                    <div key={prod._id} style={styles.card}>
                        {prod.image && (
                            <img
                                src={`${API}/${prod.image}`}
                                alt={prod.name}
                                style={styles.image}
                            />
                        )}
                        <h3>{prod.name}</h3>
                        <p>₹{prod.price}</p>
                        {prod.description && (
                            <p style={styles.description}>{prod.description}</p>
                        )}
                        <button
                            style={styles.button}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
                            onClick={() => addToCart(prod)}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;


    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Poppins, sans-serif',
            marginTop: '60px',
        },
        title: {
            textAlign: 'center',
            fontSize: '24px',
            marginBottom: '20px',
            textTransform: 'capitalize',
            
        },
        productGrid: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
        },
        card: {
            border: '1px solid #ccc',
            padding: '10px',
            width: '250px',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        },
        image: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '6px',
        },
        description: {
            fontSize: '14px',
            color: '#555',
        },
        button: {
            marginTop: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s ease',
        },
    };