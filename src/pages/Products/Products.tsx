import React, {useState, useEffect, ChangeEvent} from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
// redux selectors
import { useAppSelector } from '@app/hooks/redux_hooks'
import { Button, Input, Paper, Table } from '@app/compLibrary'
import styles from './Products.module.scss'
/// getters
import { getProducts, getRecepts } from '@app/api/Queries/Getters'

import UploadProductModal from '@app/components/Modals/UploadProductModal/UploadProductModal'
import { BouquetType, ReceptType } from '@app/api/Types/queryReturnTypes/ProductsType'

/// not found icon
import errorIcon from '@app/assets/images/error.png'

/// deleter actions
import { DeleteProduct, DeleteRecept } from '@app/api/Queries/Deletes'
import UploadReceptsModal from '@app/components/Modals/UploadReceptsModal/UploadReceptsModal'
import { getBaseUrl } from '@utils/helpers'
import DeleteConfirm from '@app/components/Modals/DeleteConfirm/DeleteConfirm'
import { SelectedDataType } from '@app/Types/SelectedData'


const Products = () => {
  const {i18n } = useTranslation()
  const locale = i18n.language as string
  /// queries
  const {
    data: productsDataList,
    refetch: refetchProducts,
    isLoading, 
    isError
  } = useQuery('getProducts', () => getProducts(), {
    refetchOnWindowFocus: false
  })

  const {
    data: receptsDataList,
    refetch: refetchRecepts,
    isLoading: isReceptsLoading, 
    isError: isReceptsError
  } = useQuery('getRecepts', () => getRecepts(), {
    refetchOnWindowFocus: false
  })

  /// states
  const [productsData, setProductsData] = useState<BouquetType[] | undefined>(productsDataList)
  const [receptsData, setReceptsData] = useState<ReceptType[] | undefined>(receptsDataList)
  const [openProdUploadModal, setOpenProdUploadModal] = useState<boolean>(false)
  const [openReceptUploadModal, setOpenReceptUploadModal] = useState<boolean>(false)
  const [openDeleteForm, setDeleteForm] = useState<boolean>(false)
  const [selectedData, setSelectedData] = useState<SelectedDataType>({
    id: "",
    label: ""
  })

  // redux selectors
  const productType = useAppSelector(state => state.productReducer.productType)

  useEffect(() => {
    if(!isLoading && !isError){
      setProductsData(productsDataList)
    }
  }, [productsDataList])

  useEffect(() => {
    if(!isReceptsError && !isReceptsLoading){
      setReceptsData(receptsDataList)
    }
  }, [receptsDataList])


  function handleSearchBouquets <T extends BouquetType[] >(event: ChangeEvent<HTMLInputElement>, data:T | any){
    const value = event.currentTarget.value?.toLowerCase();
    const result = [];

    for(let i = 0; i < data.length; i++){
      const code: any = data[i].product_code
      const desc = data[i].product_desc
      const unit = data[i].unit_name

      if(code&&code.includes(value)){
        result.push({...data[i]})
      }else if(desc&& desc.includes(value)){
        result.push({...data[i]})
      }else if(unit&&unit.includes(value)){
        result.push({...data[i]})
      } 
    }

    return result
  }

  function handleSearchRecepts <T extends ReceptType[]>(event: ChangeEvent<HTMLInputElement>, data:T | any){
    const value = event.currentTarget.value?.toLowerCase();
    const result = [];

    for(let i = 0; i < data.length; i++){
      const recept_name = data[i].recepts[locale]
      const preparation = data[i].preparation[locale]
      if(recept_name.includes(value)){
        result.push({...data[i]})
      }else if(preparation.includes(value)){
        result.push({...data[i]})
      }
      
    }
    return result
  }

  return (
    <>
    <UploadProductModal 
      product_type={productType}
      show={openProdUploadModal}
      setShow={setOpenProdUploadModal}
      onSuccess={refetchProducts}
    />
    <UploadReceptsModal 
      show={openReceptUploadModal}
      setShow={setOpenReceptUploadModal}
      onSuccess={refetchRecepts}
    />

    <DeleteConfirm 
      show={openDeleteForm}
      setShow={setDeleteForm}
      selectedData={selectedData}
      onDelete={async (data) => {
        try {
          const {id, label} = data
          let res: any;
          if(label==='product'){
            res = await DeleteProduct(id)
            const statusOk = res.status===200
            if(statusOk){
              refetchProducts()
            }
          }else if(label==='recept'){
            res = await DeleteRecept(id)
            const statusOk = res.status===200
            if(statusOk){
              refetchRecepts()
            }
          }
          setDeleteForm(false)
        } catch (error) {
          console.log(error)
        }
      }}
      onCancel={() => setDeleteForm(false)}
    />
    {
      productType === 'bouquets' ? 
      <div className={styles.bouquets__container}>
        <div className={styles.upload__part}>
          <div className={styles.inputInner}>
            <Input 
              style={{width: '400px'}}
              autoComplete='off'
              fontWeight='bold'
              fontSize='big'  
              type='search'   
              placeholder='Search product'
              onChange={e => setProductsData(handleSearchBouquets(e, productsDataList))}  
            />
          </div>
          <Button type='contained' color='theme' rounded onClick={() => setOpenProdUploadModal(true)}>Upload</Button>
        </div>

        <div className={styles.main__body}>
         {productsData && productsData.length > 0 ? 
          <Paper rounded fullHeight fullWidth style={{marginTop: '6px'}}>
          <div className={styles.table}>
            <Table 
              bodyData={productsData}
              headData={[
                '',
                'code',
                'unit',
                'description',
                'actions'
              ]}
              renderHead={(data, index) => {
                return <th key={index}>{data}</th>;
              }}
              renderBody={(data: any, index) => (
                <tr key={index} className={styles.table__body}>
                  <td>
                    <img className={styles.table__image} src={`${getBaseUrl('product')}/${data.image_name}`} />
                  </td>
                  <td>{data.product_code}</td>
                  <td>{data.unit_name}</td>
                  <td>{data.product_desc}</td>
                  <td className={styles.action__group}>
                    <div className={styles.btn__group}>
                      <Button type='contained' rounded color='theme' onClick={() => {
                        setDeleteForm(true);
                        setSelectedData((prev) => ({...prev, id: data.image_guid, label: 'product'}))
                      }}>Delete</Button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>
        </Paper>
        : <div className={styles.notFound}>
            <img src={errorIcon}/>
          </div>  
        }
        </div>
      </div>
      :
      <div className={styles.recepts__container}>
        <div className={styles.upload__part}>
          <div className={styles.inputInner}>
            <Input 
              style={{width: '400px'}}
              autoComplete='off'
              fontWeight='bold'
              fontSize='big'  
              type='search'   
              placeholder='Search recepts'  
              onChange={e => setReceptsData(handleSearchRecepts(e, receptsDataList))}  
            />
          </div>
          <Button type='contained' color='theme' rounded onClick={() => setOpenReceptUploadModal(true)}>Upload</Button>
        </div>

        <div className={styles.main__body}>
          {receptsData && receptsData?.length > 0 ? 
                    <Paper rounded fullHeight fullWidth style={{marginTop: '6px'}}>
                    <div className={styles.table}>
                      <Table 
                        bodyData={receptsData}
                        headData={[
                          '',
                          "recept_name",
                          "preparation",
                          'actions'
                        ]}
                        renderHead={(data, index) => {
                          return <th key={index}>{data}</th>;
                        }}
                        renderBody={(data: any, index) => (
                          <tr key={index} className={styles.table__body}>
                            <td>
                              <img className={styles.table__image} src={`${getBaseUrl('recept')}/${data.image_name}`} />
                            </td>
                            <td>{data.recepts[locale]}</td>
                            <td>{data.preparation[locale]}</td>
                            <td className={styles.action__group}>
                              <div className={styles.btn__group}>
                                <Button type='contained' color='theme' rounded onClick={() => {
                                  setDeleteForm(true);
                                  setSelectedData((prev) => ({...prev, id: data.image_guid, label: 'recept'}))
                                }}>Delete</Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      />
                    </div>
                  </Paper>
                  :   
                  <div className={styles.notFound}>
                    <img src={errorIcon}/>
                  </div>  
                }
        </div>
      </div>
    }

    </>
  )
}

export default Products