import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';

// react toast
import toast from 'react-hot-toast'

import styles from './Services.module.scss'
import { Button, Input, Paper, SizedBox } from '@app/compLibrary';
import { updateServices } from '@app/api/Queries/Post';


type FormikValues<T> = {
  bq_ord_number: T, 
  td_ord_number: T,
  fback_number: T
}

const Services = () => {    
  
  const formik = useFormik<FormikValues<string>>({
  initialValues: {
    bq_ord_number: "", 
    td_ord_number:"", 
    fback_number: ""
  },
  validationSchema: Yup.object({
    bq_ord_number: Yup.string().min(12).max(12).nullable(),
    td_ord_number:  Yup.string().min(12).max(12).nullable(),
    fback_number:  Yup.string().min(12).max(12).nullable()
  }),
  onSubmit: async(values: any, {resetForm}) => {
    try {
      const {bq_ord_number, td_ord_number, fback_number} = values
      if(!bq_ord_number&&!td_ord_number&&!fback_number){
        return toast.error('Please fill in at least one field to proceed.')
      }
      const res: any = await updateServices(values)
      if(res.status === 200){
        toast.success(res.message)
        resetForm()
      }
      
    } catch (error) {
      console.log(error)
    }
  }
})

  
  return (
    <>
          <div className={styles.client__container}>
            <div className={styles.form__control}>
            <form className={styles.the__form} onSubmit={formik.handleSubmit}>
              <label className={styles.input__label}>Bouquet order number</label>
              <Paper rounded removeShadow>
              <div className={styles.inputInner}>
                <Input 
                  name='bq_ord_number'
                  type='text'
                  autoComplete='off'
                  fontWeight='bold'
                  fontSize='big'
                  style={{width: '400px'}}
                  value={formik.values.bq_ord_number}
                  onChange={formik.handleChange}
                />
              </div>
              </Paper>
              <SizedBox height={15}/>
              <label className={styles.input__label}>Tudana order number</label>
              <Paper rounded removeShadow>
              <div className={styles.inputInner}>
                <Input 
                  name='td_ord_number'
                  type='text'
                  autoComplete='off'
                  fontWeight='bold'
                  fontSize='big'
                  style={{width: '400px'}}
                  value={formik.values.td_ord_number}
                  onChange={formik.handleChange}
                />
              </div>
              </Paper>
              <SizedBox height={15}/>
              <label className={styles.input__label}>Feedback number</label>
              <Paper rounded removeShadow>
              <div className={styles.inputInner}>
                <Input 
                  name='fback_number'
                  type='text'
                  autoComplete='off'
                  fontWeight='bold'
                  fontSize='big'
                  style={{width: '400px'}}
                  value={formik.values.fback_number}
                  onChange={formik.handleChange}
                />
              </div>
              </Paper>
              <SizedBox height={15}/>
              <div className={styles.form__footer}>
                <Button type='contained' rounded htmlType='submit' color='theme' style={{width: '400px', display: 'flex', justifyContent: 'center', borderRadius: '15px'}}>Save</Button>
              </div>
            </form>
            </div>
          </div>
    </>
  )
}

export default Services