import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useGetProductsQuery} from "../../features/Api/apiSlice";
import styles from "../../styles/Category.module.css"
import Products from "../Products/Products";
import {useSelector} from "react-redux";

const Category = () => {
    // Берем id из параметров с помощью хука useParams() библиотеки React Route
    const { id } = useParams()
    const { list } = useSelector(({ categories }) => categories)

    const defaultValues = {
        title: "",
        price_min: 0,
        price_max: 0,
    }

    const defaultParams = {
        ...defaultValues,
        limit: 10,
        offset: 0,
        categoryId: id
    }

    const [cat, setCat] = useState(null)
    const [isEnd, setEnd] = useState(false)
    const [items, setItems] = useState([])

    const [values, setValues] = useState(defaultValues)
    const [params, setParams] = useState(defaultParams)


    const { data = [], isLoading, isSuccess } = useGetProductsQuery(params) //useGetProductsByCategoryQuery(id)

    useEffect(() => {
        if (!id) return

        setValues(defaultValues)
        setItems([])
        setEnd(false)
        setParams({...defaultParams, categoryId: id})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])


    useEffect(() => {
        console.log(isLoading, data.length)
        if ( isLoading ) return
        if (!data.length) return setEnd(true)

        setItems((_items) => [..._items, ...data])
    },[data, isLoading])


    useEffect(() => {
        if (!id || !list.length) return

        const category = list.find((c) => c.id === Number(id)  )
        setCat(category)
    }, [id, list])






    const handleChange = ({ target: { value, name } }) => {
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        //console.log(params)
        //console.log(values)
        setItems([])
        setEnd(false)
        setParams({...defaultParams, ...values})
    }

    const handleReset = () => {
        setValues(defaultValues)
        setParams(defaultParams)
        setEnd(false)
    }
    return (
        <section className={styles.wrapper}>
            <h2 className={styles.title}>{cat?.name}</h2>
            <form className={styles.filters} onSubmit={handleSubmit}>
                <div className={styles.filter}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Product name"
                        onChange={handleChange}
                        value={values.title}
                    />
                </div>
                <div className={styles.filter}>
                    <input
                        type="number"
                        name="price_min"
                        placeholder="Price min"
                        onChange={handleChange}
                        value={values.price_min}
                    />
                    <span>Price from</span>
                </div>
                <div className={styles.filter}>
                    <input
                        type="number"
                        name="price_max"
                        placeholder="Price max"
                        onChange={handleChange}
                        value={values.price_max}
                    />
                    <span>Price to</span>
                </div>
                <button type="submit" hidden />
            </form>

            {isLoading ? (
                <div className="preloader">Loading...</div>
            ) : !isSuccess || !items.length ? (
                <div className={styles.back}>
                    <span>No Results</span>
                    <button onClick={handleReset}>Reset</button>
                </div>
            ) : (
                <Products products={items} style={{ padding: 0 }} amount={items.length}/>
            )}

            {!isEnd && (<div className={styles.more}>
                <button onClick={() => setParams({...params, offset: params.offset + params.limit})}>
                    See more
                </button>
            </div>)}
       </section>
    );
};

export default Category;
