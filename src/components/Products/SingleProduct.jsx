import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useGetProductQuery} from "../../features/Api/apiSlice";
import {ROUTES} from "../../utils/routes";
import Product from "./Product";
import Products from "./Products";
import {useDispatch, useSelector} from "react-redux";
import {getRelatedProducts} from "../../features/products/productsSlice";

const SingleProduct = () => {

    const dispatch = useDispatch()
    const { id } = useParams()
    // use hook ReactRouterDom
    const navigate = useNavigate()

    const { data, isLoading, isFetching, isSuccess } = useGetProductQuery(id)

    const { list, related } = useSelector(({products}) => products);

    useEffect(() => {
        if (!isFetching && !isLoading && !isSuccess) {
            navigate(ROUTES.HOME)
        }
    }, [isFetching, isLoading, isSuccess, navigate])

    useEffect(() => {
        if (!data || !list.length) return

        dispatch(getRelatedProducts(data.category.id))

    }, [dispatch, data, list.length])

    return !data ? (
        <section className="preloader">Loading...</section>
    ) : (
        <>
            <Product {...data}/>
            <Products products={related} amount={5} title="Related Products" />
        </>

    );
};

export default SingleProduct;
