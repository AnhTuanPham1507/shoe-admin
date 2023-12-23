/* eslint-disable no-unused-vars */
import * as _ from 'lodash';
import { AxiosError } from 'axios';
/* eslint-disable no-shadow */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Stack, Select, Button, MenuItem, Container, FormLabel, TextField, Typography } from "@mui/material";

import { productAPI , partnerAPI, categoryAPI, classificationAPI } from 'src/api/api-agent';

import AleartPopup from 'src/components/alert-popup/alert-popup';

import { isString } from '../utils/validator';

export default function CreateProduct() {
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [category, setCategory] = useState(null);
    const [partner, setPartner] = useState(null);
    const [mainClassification, setMainClassification] = useState(null);
    const [subClassification, setSubClassification] = useState(null);

    const [categories, setCategories] = useState([]);
    const [partners, setPartners] = useState([]);
    const [classifications, setClassifications] = useState([]);

    const [message, setMessage] = useState(null);
    const [title, setTitle] = useState(null);
    const [activeMessage, setActiveMessage] = useState(false);
    const [color, setColor] = useState(null);

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const initialDataRes = await Promise.all([
                    categoryAPI.getAll(),
                    partnerAPI.getAll(),
                    classificationAPI.getAll()
                ])
                const tempCategories = initialDataRes[0].data.data;
                const tempPartners = initialDataRes[1].data.data;
                const tempClassifications = initialDataRes[2].data.data;

                setCategories(tempCategories);
                setCategory(_.first(tempCategories)?._id)

                setPartners(tempPartners);
                setPartner(_.first(tempPartners)?._id)

                setClassifications(tempClassifications);
                setMainClassification(_.first(tempClassifications)?._id)

                setSubClassification(tempClassifications[1]?._id)
            } catch (error) {   
                console.log(error);
            }
        };

        getInitialData()
    }, [])


    const renderNameInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Tên sản phẩm<span style={{color:"red"}}>*</span></strong></FormLabel>
            <TextField placeholder='Hãy cho tôi một cái tên sản phẩm thiệt hay...' size='small' value={name} onChange={(e) => setName(e.target.value)} required/>
        </Stack>
    )

    const renderDescriptionInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>Mô tả:</strong></FormLabel>
            <CKEditor
                editor={ ClassicEditor }
                data={description}
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setDescription(data);
                } }
            /> 
        </Stack>
    )

    const renderCategorySelections = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>Loại sản phẩm<span style={{color:"red"}}>*</span></strong></FormLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                {
                    categories.map((cate) => (
                        <MenuItem id={cate._id} value={cate._id}>{cate.name}</MenuItem>
                    ))
                }
            </Select>
        </Stack>
    )

    const renderPartnerSelections = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
            <FormLabel><strong>Thương hiệu<span style={{color:"red"}}>*</span></strong></FormLabel>
            <Select value={partner} onChange={(e) => setPartner(e.target.value)}>
                {
                    partners.map((partner) => (
                        <MenuItem id={partner._id} value={partner._id}>{partner.name}</MenuItem>
                    ))
                }
            </Select>
        </Stack>
    )

    // const renderMainClassificationSelections = (
    //     <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
    //         <FormLabel><strong>Phân loại sản phẩm chính<span style={{color:"red"}}>*</span></strong></FormLabel>
    //         <Select value={mainClassification} onChange={(e) => setMainClassification(e.target.value)} required>
    //             {
    //                 classifications.map((classification) => (
    //                     <MenuItem id={classification._id} value={classification._id}>{classification.title}</MenuItem>
    //                 ))
    //             }
    //         </Select>
    //     </Stack>
    // )

    // const renderSubClassificationSelections = (
    //     <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart">
    //         <FormLabel><strong>Phân loại sản phẩm phụ:</strong></FormLabel>
    //         <Select value={subClassification} onChange={(e) => setSubClassification(e.target.value)}>
    //             {
    //                 classifications.map((classification) => (
    //                     <MenuItem disabled={classification._id === mainClassification} id={classification._id} value={classification._id}>{classification.title}</MenuItem>
    //                 ))
    //             }
    //         </Select>
    //     </Stack>
    // )


    const setErrorMessage = (_message) => {
        setTitle('Thao tác thất bại');
        setMessage(_message);
        setColor('red');
        setActiveMessage(true);
        setTimeout(() => {
            setActiveMessage(false)
        }, 3000)
    }

    const setSuccessfulMessage = (_message) => {
        setTitle('Thao tác thành công');
        setMessage(_message);
        setColor('green');
        setActiveMessage(true);
        setTimeout(() => {
            setActiveMessage(false)
        }, 3000)
    }

    const validateFormData = () => {
        switch(true){
            case (!isString(name)):{
                setErrorMessage('Tên sản phẩm không hợp lệ')
                return false;
            }

            case (!isString(description, true)):{
                setErrorMessage('Mô tả không hợp lệ')
                return false;
            }

            case (!isString(category)):{
                setErrorMessage('Mô tả không hợp lệ')
                return false;
            }

            case (!isString(partner)):{
                setErrorMessage('Mô tả không hợp lệ')
                return false;
            }

            case (!isString(mainClassification)):{
                setErrorMessage('Mô tả không hợp lệ')
                return false;
            }

            case (!isString(subClassification, true)):{
                setErrorMessage('Mô tả không hợp lệ')
                return false;
            }
            default: {return true;}
        }
    }


    const handleFormSubmit = async () => {
        try {
            if(validateFormData) {
                const createdProductRes = await productAPI.create(
                    _.omitBy({
                        name, description, partner, category, mainClassification, subClassification
                    }, _.isNil
                    )
                );
                setSuccessfulMessage(`Sản phẩm ${name} đã được thêm thành công, xin cảm ơn `)
            }       
        } catch (error) {
            setErrorMessage(
                error instanceof AxiosError ? error.response.data.message : `Thêm sản phẩm ${name} thất bại vui lòng thử lại.`
            )
            console.log(error);
        }
        
    }

    return (
        <>
            <Helmet>
                <title>Tạo Sản phẩm</title>
            </Helmet>
            
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
                    <Typography variant="h4">Tạo sản phẩm</Typography>
                </Stack>

                <Stack direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                    {renderCategorySelections}
                    {renderPartnerSelections}
                    {renderNameInput}
                    {renderDescriptionInput}
                    {/* {renderMainClassificationSelections}
                    {renderSubClassificationSelections} */}

                    <Stack direction="column" mb={5}>
                        <Button onClick={() => { handleFormSubmit() }} variant="contained">Lưu</Button>
                    </Stack>
                </Stack>
            </Container>
            <AleartPopup message={message} title={title} isActive={activeMessage} color={color} />

        </>
    )
}