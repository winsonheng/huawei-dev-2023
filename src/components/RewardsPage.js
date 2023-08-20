import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap'
import { Link } from 'react-router-dom'
import '../assets/styles/RewardsPage.css'
import { BACKEND_BASE_URL, PATH } from '../constants/config'
import { HttpMethod, StatusCode, postData } from '../util/RestUtil'
import { PRODUCTS_GET_MY_PRODUCTS } from '../constants/endpoints'
import ProductCard from './ProductCard'

export default function RewardsPage() {

  const [productList, setProductList] = useState(null);

  useEffect(() => {
    getProductsFromDB();
  }, []);

  function getProductsFromDB() {
    console.log('Retrieving your products...');
    setProductList((prev) => null);
    postData(
      HttpMethod.GET,
      BACKEND_BASE_URL + PRODUCTS_GET_MY_PRODUCTS,
      {},
      true
    ).then(response => {
      if (response.status === StatusCode.OK) {
        console.log("Here are your products: ");
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
          My Products
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
