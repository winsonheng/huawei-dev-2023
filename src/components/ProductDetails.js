import React, { useEffect, useRef, useState } from 'react'
import '../assets/styles/ProductDetails.css'
import { BACKEND_BASE_URL, PATH } from '../constants/config';
import { Link, useLocation, useParams } from 'react-router-dom';
import { removeFileExtension } from '../util/FileUtil';
import { HttpMethod, StatusCode, postData } from '../util/RestUtil';
import { PRODUCTS_GET_PRODUCT_BY_ID } from '../constants/endpoints';

export default function ProductDetails(props) {
  const { productid } = useParams();

  const location = useLocation();

  const [product, setProduct] = useState(location.state == null ? null : location.state.product);
  const [isLoaded, setIsLoaded] = useState(false);

  const visualizer = useRef();

  useEffect(() => {
    if (product === null) {
      return;
    }
    console.log("HERE");
    console.log(visualizer.current)
    setIsLoaded(prev => true);
  }, [product]);

  function getProduct() {
    postData(
      HttpMethod.GET, 
      BACKEND_BASE_URL + PRODUCTS_GET_PRODUCT_BY_ID.replace(':productid', productid),
      {},
      true
    ).then(response => {
      if (response.status === StatusCode.OK) {
        console.log(response.data);
        setProduct(prev => response.data.product[0]);
      }
    })
  }

  if (product === null) {
    getProduct();
    return (
      <div className='loading-animation'></div>
    );
  }

  return (
    <div className='product-details'>
      <div className='product-top'>
        <h2 className='product-title'>
          {removeFileExtension(product.name)}
        </h2>
        
      </div>
      <div className='product-bottom'>
      </div>
    </div>
  )
}
