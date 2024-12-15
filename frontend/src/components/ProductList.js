import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from './ProductList.module.css';

function ProductList() {
  const { darkMode } = useTheme();
  const [products] = useState([
    { id: 1, name: 'Product 1', quantity: 10, category: 'Category A' },
    { id: 2, name: 'Product 2', quantity: 15, category: 'Category B' },
    { id: 3, name: 'Product 3', quantity: 20, category: 'Category A' },
    { id: 4, name: 'Product 4', quantity: 5, category: 'Category C' },
    { id: 5, name: 'Product 5', quantity: 25, category: 'Category B' },
  ]);

  const downloadProductList = () => {
    const productListCSV = products.map(product => 
      `${product.id},${product.name},${product.quantity},${product.category}`
    ).join('\n');
    
    const blob = new Blob([`ID,Name,Quantity,Category\n${productListCSV}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${styles.productList} ${darkMode ? styles.darkMode : ''}`}>
      <h2>Current Inventory</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={downloadProductList} className={styles.downloadButton}>
        Download Product List
      </button>
    </div>
  );
}

export default ProductList;

