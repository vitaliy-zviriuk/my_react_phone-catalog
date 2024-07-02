/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSearchParams } from 'react-router-dom';
import { Loader } from '../../Components/Loader/Loader';
import { Pagination } from '../../Components/Pagination/Pagination';
import { getProduct } from '../../helper/api';
import { getSearchWith } from '../../helper/searchHelper';
import { useContext, useEffect, useState } from 'react';
import '../ProductPages/Pages.scss';
import { ProductContext } from '../../helper/ProductContext';
import { NoResults } from '../../Components/NoResults/NoResults';
import { Breadcrumbs } from '../../Components/Breadcrumbs/Breadcrumbs';
import { CustomSelect } from '../../Components/CustomSelect/CustomSelect';

export const AccessoriesPage = () => {
  const { product, setProduct, setAppliedQuery } = useContext(ProductContext);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [accessAmount, setAccessAmount] = useState(0);
  const sort = searchParams.get('sort') || 'age';
  const perPage = searchParams.get('perPage') || 'all';
  const currentPage = searchParams.get('page') || '1';

  const option = ['4', '8', '16', 'all'];

  function setSearchWith(param: any) {
    const search = getSearchWith(searchParams, param);

    setSearchParams(search);
  }

  const onArrowClick = (value: number) => {
    setSearchWith({ page: value.toString() });
  };

  const onClickPage = (page: string) => {
    if (currentPage !== page) {
      setSearchWith({ page: page.toString() });
    }
  };

  const selectHandler = (value: string) => {
    const selectedValue = value;

    setSearchWith({ sort: selectedValue });
  };

  const selectPerPage = (value: string) => {
    const selectedValue = value;

    if (selectedValue) {
      setSearchWith({ perPage: selectedValue });
    }
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);

    params.set('sort', 'age');
    params.set('page', '2');
    params.set('perPage', '8');
    params.set('query', 'value');
    setSearchParams(params);

    getProduct('accessories')
      .then(response => {
        setProduct(response);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      setAppliedQuery('');
    };
  }, []);

  return loading ? (
    <Loader />
  ) : !!product.length ? (
    <div className="productPage">
      <div className="productPage__items">
        <Breadcrumbs device="accessories" />
        <div className="productPage__headings">
          <h1 className="productPage__h1">Accessories</h1>
          <p className="productPage__text">{`${accessAmount} models`}</p>
        </div>

        <div className="productPage__selecting">
          <div className="productPage__select-container">
            <label
              className="productPage__small-text"
              htmlFor="ProductPageSelector"
            >
              Sort by
            </label>

            <CustomSelect
              options={[
                { label: 'Newest', value: 'age' },
                { label: 'Alphabetically', value: 'name' },
                { label: 'Cheapest', value: 'price' },
              ]}
              defoultValue={'Newest'}
              selectHandler={selectHandler}
            />
          </div>

          <div className="productPage__select-container" data-cy="pagination">
            <label
              className="productPage__small-text"
              htmlFor="productPagePagination"
            >
              items on page
            </label>

            <CustomSelect
              optionsPerPage={option}
              defoultValuePerPage={'8'}
              selectPerPage={selectPerPage}
            />
          </div>
        </div>
      </div>

      <div className="productPage__pagination">
        <Pagination
          onChangeProducts={newAccessories => {
            setAccessAmount(newAccessories);
          }}
          products={product}
          sort={sort}
          perPage={perPage}
          currentPage={currentPage}
          onClickPage={onClickPage}
          onArrowClick={onArrowClick}
        />
      </div>
    </div>
  ) : (
    <NoResults />
  );
};
