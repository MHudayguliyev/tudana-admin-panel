import React, {  useState, useEffect, useRef } from 'react';

// own component library
import { Button, Col, Input, Modal, Paper, Preloader, Row, SizedBox } from '@app/compLibrary';
import { useMatch } from '@tanstack/react-location';
// custom styles
import styles from './NewAddClient.module.scss';
// for form validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
// types
import CommonModalI from '../commonTypes';
import { useTranslation } from 'react-i18next';
// queries
import { getClientCode } from '@app/api/Queries/Getters';
import { post } from '@app/api/service/api_helper';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppDispatch} from '@app/hooks/redux_hooks';
import ClientsAction from "@app/redux/actions/ClientsAction";
import { isEmpty } from '@utils/helpers';

function checkIfPhoneError(client_phone: any) {
    const phone1 = client_phone.slice(0, 1)
    const phone2 = client_phone.slice(1, 2)

    if(phone1 != 1 && phone2 !=2 || phone1 ==1 && phone2 !=2 || phone1 !=1 && phone2 ==2){
        if(phone1 != 6 && phone2 > 5 || 
            phone1==6 && phone2 > 5 || 
            phone1!=6 && phone2<=5 || 
            phone1==6 && phone2==0
            ){
                return true
            }
    }
    return false
}

function checkIfAddPhoneError(client_addition_phone: any) {
    if(client_addition_phone.length > 0){
        const addPhone1 = client_addition_phone.slice(0, 1)
        const addPhone2 = client_addition_phone.slice(1, 2)

        if(addPhone1 != 1 && addPhone2 !=2 || addPhone1 ==1 && addPhone2 !=2 || addPhone1 !=1 && addPhone2 ==2){
            if(addPhone1 != 6 && addPhone2 > 5 || 
                addPhone1==6 && addPhone2 > 5 || 
                addPhone1!=6 && addPhone2<=5 || 
                addPhone1==6 && addPhone2==0
                ){
                    return true
                }
        }
        return false
    }
    return false
}

type FormikValues = {
    client_name: string
    client_full_name: string
    client_phone: string
    client_address: string
    client_addition_address: string
    client_addition_phone: string
    client_code?: string
    client_guid?: string,
}

interface AddClientProps extends CommonModalI {
    translate: Function
    editData?: any,
    setEditMode?: Function | any,
    editMode?: boolean,
    onAdd: (object: any) => void,
    onUpdate?: any
    onSuccess?: any
}

interface PhoneTypes {
    client_phone: string,
    client_addition_phone: string
}

const AddClient = (props: AddClientProps) => {
    const {
        show,
        setShow,
        translate,
        editData,
        setEditMode,
        editMode = false,
        onAdd,
        onUpdate,
        onSuccess
    } = props;



    // loading state for client code
    const [loadingOrderCode, setLoadingOrderCode] = useState(false);
    const [clientCode, setClientCode] = useState<any>('')
    const [isSubmitted, setSubmitted] = useState<boolean>(false)

    const [phoneErr, setPhoneErr] = useState<PhoneTypes>({
        client_phone: '',
        client_addition_phone: ''
    })

    const codeRef = useRef()
    codeRef.current = clientCode



    const dispatch = useAppDispatch();
    const match = useMatch()
    const {t} = useTranslation()

    const setShowModal: Function = () => {
        dispatch(ClientsAction.setModal(false))
    }

    useEffect(() => {
        if(isSubmitted)
            getGenerateOrderCode()

    }, [isSubmitted])



    const formik = useFormik<FormikValues>({
        initialValues: {
            client_code: editMode ? editData.client_code : '',
            client_guid: editMode ? editData.client_guid : '',
            client_name: editMode ? editData.client_name : '',
            client_full_name: editMode ? editData.client_full_name : '',
            client_phone: editMode ? editData.client_telephone: '',
            client_address: editMode ? editData.client_address : '',
            client_addition_address: editMode && editData.addition_addresses !== null  ? editData.addition_addresses : '',
            client_addition_phone: editMode && editData.addition_telephones !== null ? editData.addition_telephones : '',
        },
        validationSchema: Yup.object({
            client_name: Yup.string().min(3, translate('nameMin')).required(translate('requiredField')),
            client_full_name: Yup.string().min(3, translate('nameMin')).required(translate('requiredField')),
            client_phone: Yup.string().matches(/^[0-9]+$/, translate("onlyDigit")).min(8, translate('exactDigit')).max(8, translate('exactDigit')).required(translate('requiredField')),
            client_address: Yup.string().min(3, translate('addrMin')).required(translate('requiredField')),
            client_addition_address: Yup.string().min(3, translate('addrMin')).nullable(),
            client_addition_phone: Yup.string().matches(/^[0-9]+$/, translate("onlyDigit")).min(8, translate('exactDigit')).max(8, translate('exactDigit')).nullable(),
            client_balans: Yup.number(),
        }),
        onSubmit: async (values: any, { resetForm }) => {
            try {
                if(!editMode){
                    setSubmitted(true)
                    setTimeout(async () => {                   
                        const to = 
                        {
                            client_name: values.client_name,
                            client_full_name: values.client_full_name,
                            client_phone: values.client_phone,
                            client_address: values.client_address, 
                            client_addition_address: values.client_addition_address,
                            client_addition_phone: values.client_addition_phone,
                            client_code: codeRef.current
                        }
                        const res: any = await post('/create-order/new-client', to)

                        if (res.status === 201 && match.id === 'contacts') {
                            const obj = res.response[0] ? res.response[0] : {}
                            onAdd(obj)
                            toast.success(translate('successfull'))
                            setClientCode('')
                            setShowModal();
                            setSubmitted(false)
                            resetForm()
                        }
                        if(res.status === 201 && match.id === 'orders/make-order/') {
                            await onSuccess()
                            toast.success(translate('successfull'))
                            setClientCode('')
                            setShow(false);
                            setSubmitted(false)
                            resetForm()
                        }
                    }, 2000)



                }  else {

                    const res:any = await post('/clients/edit-client', values)
                    if(res.msg === 'Client Successfully edited!'){
                        const obj = res.response[0] ? res.response[0] : {}
                        onUpdate(obj)
                        toast.success(translate('successfull'))
                        setShowModal();
                        setEditMode(false)
                        resetForm()
                    }




                }
            } catch (err) { 
                if (axios.isAxiosError(err)){
                    console.log(err)
                    if(err.response){
                        if(err.response.data){
                            toast.error(`${err?.response?.data}`)
                        }else {
                            toast.error(`${err?.response}`)
                        }
                    }else {
                        toast.error(`${err}`)
                    }
                }
                    
            }
        }
    });

    // getting client code
    const getGenerateOrderCode = async () => {
        setLoadingOrderCode(true)
        try {
            const res = await getClientCode()
            setClientCode(res)
        } catch (err) {
            console.error(err)
        }
        setLoadingOrderCode(false)
    }
    return (
        <Modal
            className={styles.clientModal}
            isOpen={show}
            close={() => { 
                match.pathname == '/contacts' ? setShowModal() : setShow(false)
                editMode && setEditMode(false)
             }}
            header={
                <div className={styles.headerTxt}>
                    <h4 className={styles.txt}>
                        {translate('addClient')}
                    </h4>
                </div>
            }
        >
            <form onSubmit={formik.handleSubmit}>
                <div className={styles.modalClientBody} id='modalClientBody'>
                    <div className={styles.addClientModal}>
                        <div className={styles.formInputs}>
                            <div>
                                    <span className={styles.inputTitle}>
                                        {translate('shortName')}
                                    </span>
                                    <SizedBox height={10} />
                                    <Paper fullWidth rounded removeShadow>
                                        <div className={styles.inputInner}>
                                            <Input
                                                fontWeight='bold'
                                                fontSize='big'
                                                type='text'
                                                name="client_name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.client_name}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </Paper>
                                    <SizedBox height={5} />
                                {formik.errors.client_name && formik.touched.client_name ? 
                                <div className={styles.emptySection}>
                                   <span className={styles.errorTxt}>{formik.errors.client_name}</span>
                                </div>
                                    : <div className={styles.emptySection} />
                                }
                                <SizedBox height={10} />
                            </div>
                            <div>
                                    <span className={styles.inputTitle}>
                                        {translate('fullName')}
                                    </span>
                                    <SizedBox height={10} />
                                    <Paper fullWidth rounded removeShadow>
                                        <div className={styles.inputInner}>
                                            <Input
                                                fontWeight='bold'
                                                fontSize='big'
                                                type='text'
                                                name="client_full_name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.client_full_name}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </Paper>
                                {/* </div> */}
                                <SizedBox height={5} />
                                {formik.errors.client_full_name && formik.touched.client_full_name ? 
                                <div className={styles.emptySection}>
                                    <span className={styles.errorTxt}>{formik.errors.client_full_name}</span>
                                </div>
                                : <div className={styles.emptySection}/>
                                }
                                <SizedBox height={10} />
                            </div>
                        </div>
                        
                    <div className={styles.formInputs}>
                        <div>
                            {/* <div className={styles.formikInput}> */}
                                <span className={styles.inputTitle}>
                                    {translate('address')}
                                </span>
                                <SizedBox height={10} />
                                <Paper fullWidth rounded removeShadow>
                                    <div className={styles.inputInner}>
                                        <Input
                                            fontWeight='bold'
                                            fontSize='big'
                                            type='text'
                                            name="client_address"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.client_address}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </Paper>
                            {/* </div> */}
                            <SizedBox height={5} />
                            {formik.errors.client_address && formik.touched.client_address ? 
                            <div className={styles.emptySection}>
                                <span className={styles.errorTxt}>{formik.errors.client_address}</span>
                            </div>
                            : <div className={styles.emptySection} />
                            }
                            <SizedBox height={10} />
                        </div>
                        <div>
                                <span className={styles.inputTitle}>
                                    {translate('additionAddress')}
                                </span>
                                <SizedBox height={10} />
                                <Paper fullWidth rounded removeShadow>
                                    <div className={styles.inputInner}>
                                        <Input
                                            fontWeight='bold'
                                            fontSize='big'
                                            type='text'
                                            name="client_addition_address"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.client_addition_address}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </Paper>
                                <SizedBox height={5} />
                                {formik.errors.client_addition_address && formik.touched.client_addition_address ? 
                                 <div className={styles.emptySection}>
                                    <span className={styles.errorTxt}>{formik.errors.client_addition_address}</span>
                                 </div>
                                : <div className={styles.emptySection} />
                                }
                            <SizedBox height={10} />
                        </div>
                    </div>

                    <div className={styles.formInputs}>
                        <div>
                                <span className={styles.inputTitle}>
                                    {translate('phoneNumber')}
                                </span>
                                <SizedBox height={10} />
                                <Paper fullWidth rounded removeShadow>
                                    <div className={styles.inputInner}>
                                        <div className={styles.phoneNm}>
                                            +993
                                        </div>
                                        <Input
                                            fontWeight='bold'
                                            fontSize='big'
                                            type='text'
                                            maxLength={8}
                                            onInput={(e) => {
                                                if(phoneErr.client_phone.length > 0){
                                                    setPhoneErr({client_phone: '', client_addition_phone: ''})
                                                }
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/gi, "")
                                            }}
                                            name="client_phone"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.client_phone}
                                            style={{ width: '100%',paddingLeft: '45px' }}
                                        />
                                    </div>
                                </Paper>
                            <SizedBox height={5} />
                            {formik.errors.client_phone && formik.touched.client_phone ? 
                                <div className={styles.emptySection}>
                                    <span className={styles.errorTxt}>{formik.errors.client_phone}</span>
                                </div>
                            :  <div className={styles.emptySection} />
                            }
                            <SizedBox height={10} />
                        </div>
                        <div>
                                <span className={styles.inputTitle}>
                                    {translate('additionPhoneNumber')}
                                </span>
                                <SizedBox height={10} />
                                <Paper fullWidth rounded removeShadow>
                                    <div className={styles.inputInner}>
                                        <div className={styles.phoneNm}>
                                            +993 
                                        </div>
                                        <Input
                                            fontWeight='bold'
                                            fontSize='big'
                                            maxLength={8}
                                            type='text'
                                            onInput={(e) => {
                                                if(phoneErr.client_addition_phone.length > 0){
                                                    setPhoneErr({client_phone: '', client_addition_phone: ''})
                                                }
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/gi, "")
                                            }}
                                            name="client_addition_phone"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.client_addition_phone}
                                            style={{ width: '100%', paddingLeft: '45px'}}
                                        />
                                    </div>
                                </Paper>
                                <SizedBox height={5} />
                            {formik.errors.client_addition_phone && formik.touched.client_addition_phone ? 
                            <div className={styles.emptySection}>
                                <span className={styles.errorTxt}>{formik.errors.client_addition_phone}</span>
                            </div>
                            : <div className={styles.emptySection}/>
                            }
                        <SizedBox height={10} />
                        </div>

                    </div>
                    </div>
                    <SizedBox height={10} />
                    <div className={styles.materialsModalFooter}>
                        <div className={styles.buttonWrapperRight}>
                        <div className={styles.generateCode}>
                        {
                        !loadingOrderCode ?
                            clientCode ?
                                <span className={styles.codeSpan} style={{ fontWeight: 'bold', lineHeight: '24px' }}>
                                    {translate('code')}:{" "}
                                    {clientCode}
                                </span>
                                : null
                            :
                            <Preloader />
                    }
                        {
                            editMode ? editData && editData.client_code : !clientCode ?
                                // <>
                                //     <Button
                                //         rounded
                                //         color="theme"
                                //         onClick={() => getGenerateOrderCode()}
                                //         startIcon={<i className='bx bx-barcode-reader'></i>}
                                //     >
                                //         {translate('generateCode')}
                                //     </Button>
                                // </>
                                null
                                :
                                null
                        }
                        </div>
                            <div className={styles.btns}>
                            <Button rounded color='grey' center onClick={() => {
                                setShowModal()
                                setShow(false);
                                editMode && setEditMode(false)
                            }}>
                                {translate('cancel')}
                            </Button>
                            <Button rounded color='theme' center htmlType='submit'>
                                {translate('confirm')}
                            </Button>

                            </div>
                        
                        </div>  
                    </div>
                </div>
            </form>
        </Modal >
    )
}

export default AddClient;