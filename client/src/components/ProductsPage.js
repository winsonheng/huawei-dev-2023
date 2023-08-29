import '../assets/styles/ProductsPage.css'
import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap'
import { Link } from 'react-router-dom'
import { BACKEND_BASE_URL, PATH } from '../constants/config'
import { HttpMethod, StatusCode, postData } from '../util/RestUtil'
import { PRODUCTS_GET_ALL_PRODUCTS, PRODUCTS_GET_MY_PRODUCTS } from '../constants/endpoints'
import ProductCard from './ProductCard'

export default function ProductsPage() {
  const [productList, setProductList] = useState(null);

  useEffect(() => {
    getProductsFromDB();
  }, []);

  function getProductsFromDB() {
    console.log('Retrieving your products...');
    setProductList((prev) => null);
    postData(
      HttpMethod.GET,
      BACKEND_BASE_URL + PRODUCTS_GET_ALL_PRODUCTS,
      {},
      true
    ).then(response => {
      if (response.status === StatusCode.OK) {
        console.log("Here are all the products: ");
        setProductList((prev) => {
          return response.data.productList;
        });
      }
    });
  }

  return (
    <div className='myproducts'>
      <div className='myproducts-top'>
        <h2 className='myproducts-title'>
          Global Playlist
        </h2>
        <Link to={PATH.LANDING_PAGE} className='myproducts-upload-btn-wrapper'>
          <button className='myproducts-upload-btn'>
            + Add New Product
          </button>
        </Link>
      </div>
      <div className='myproducts-bottom'>
        <ProductCard productList={productList}></ProductCard>
      </div>
    </div>
  )
}
