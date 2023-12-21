/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { MultiSelect } from 'react-multi-select-component';

import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Stack, Button, Dialog, Select, MenuItem, FormLabel, TextField, IconButton, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { fCurrency, deCodeCurrenry } from 'src/utils/format-number';

import { productAPI } from "src/api/api-agent";

import Iconify from 'src/components/iconify';

export default function CreateImportWarehouseOrder({isShow, onFormSubmit, onClose, creatorName, showErrorMessage}) {
    const [importedAt, setImportedAt] = useState(null);
    const [details, setDetails] = useState([]);
    const [products, setProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedMainClassificationValue, setSelectedMainClassificationValue] = useState(null);
    const [selectedSubClassificationValues, setSelectedSubClassificationValues] = useState([]);
    const [price, setPrice] = useState(null);
    const [quantity, setQuantity] = useState(null);

    
    useEffect(
        () => {
          const getProductList = async () => {
            try {
              const getProductListRes = await productAPI.getAll();
              const tempProductList = getProductListRes.data;
    
              setProducts(tempProductList.data);
            } catch (error) {
              console.log(error)
            }
          }
          getProductList();
        }, []
      )

    const renderImportedAtInput = (
        <Stack style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel><strong>Ngày nhâp</strong></FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker onChange={(e) => {setImportedAt(e.$d.toString())}} />
            </LocalizationProvider>    
        </Stack>
    )

    const renderDetailInput = (
        <Stack  direction="Column" alignItems="flexStart" justifyContent="flexStart" >
            <FormLabel style={{textAlign: 'center'}}><strong>Thêm Chi tiết</strong></FormLabel>
            <Stack  direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                <FormLabel><strong>Sản phẩm<span style={{color:"red"}}>*</span></strong></FormLabel>
                <Select value={selectedProduct?._id} onChange={(e) => {setSelectedProduct(products.find(p => p._id === e.target.value))}}>
                    {
                        products.map(product => (   
                            <MenuItem value={product._id}>{product.name}</MenuItem>
                        ))
                    }
                </Select>
            </Stack>
            <Stack  direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                <FormLabel><strong>Phân loại chính<span style={{color:"red"}}>*</span></strong></FormLabel>
                <Select onChange={(e) => {setSelectedMainClassificationValue(e.target.value); setSelectedSubClassificationValues([])}}>
                    {
                        [...new Set(selectedProduct?.details.map(i => i.mainClassificationValue))].map(mainClassificationValue => (
                            <MenuItem value={mainClassificationValue}>{mainClassificationValue}</MenuItem>
                        ))
                    }
                </Select>
            </Stack>
            {
                selectedProduct?.subClassification &&
                (
                    <Stack  direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                        <FormLabel><strong>Phân loại phụ<span style={{color:"red"}}>*</span></strong></FormLabel>
                        <MultiSelect
                            options={
                                selectedProduct.details.reduce((arr, i) => {
                                    if(i.mainClassificationValue === selectedMainClassificationValue && !arr.includes(i.subClassificationValue)){
                                        arr.push({
                                            label: i.subClassificationValue,
                                            value: i.subClassificationValue
                                        })
                                    }
                                    return arr;
                                }, [])
                            }
                            overrideStrings={{
                                selectAll:"Chọn tất cả", 
                                selectSomeItems: `${selectedProduct.subClassification.title}...`,
                                search: 'Tìm kiếm',
                                allItemsAreSelected: `Tất cả ${selectedProduct.subClassification.title}`,
                                noOptions: `Không tìm thấy ${selectedProduct.subClassification.title} này`,
                            }}
                            value={selectedSubClassificationValues.map(subClassificationValue => ({
                                label: subClassificationValue.value,
                                value: subClassificationValue.value
                            }))}
                            onChange={(e) => {
                                const tempSubClassificationValues = e.map(
                                    (item) => {
                                    const foundSubClassification = selectedSubClassificationValues.find(v => v.value === item.value);
                                        console.log(foundSubClassification || {
                                            value: item.value,
                                            price: 0,
                                            quantity: 0
                                        })
                                    return foundSubClassification || {
                                            value: item.value,
                                            price: 0,
                                            quantity: 0
                                        }
                                    }
                                )

                                setSelectedSubClassificationValues(tempSubClassificationValues);
                            }}
                        />
                    </Stack>
                )
            }
            {
                selectedProduct?.subClassification ?
                selectedSubClassificationValues.map(subClassificationValue => (
                    <Stack direction='Row' alignItems="flexStart" justifyContent="flexStart">
                        <FormLabel style={{width: '5em'}}><strong>{subClassificationValue.value.toUpperCase()}:</strong></FormLabel>
                        <Stack paddingLeft={2} style={{marginBottom: '10px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                            <FormLabel><strong>Giá<span style={{color:"red"}}>*</span></strong></FormLabel>
                            <TextField patter="^[0-9]*$" size='small' value={fCurrency(subClassificationValue.price)} onChange={(e) => {
                                    const tempValues = selectedSubClassificationValues.map(v => {
                                        if(v.value === subClassificationValue.value){
                                            v.price = deCodeCurrenry(e.target.value);
                                        }
                                        return v;
                                    });
                                    setSelectedSubClassificationValues(tempValues)
                                }} required/>
                        </Stack>
                        <Stack paddingLeft={2} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                            <FormLabel><strong>Số lượng nhập</strong></FormLabel>
                            <TextField type='number' size='small' value={subClassificationValue.quantity} onChange={(e) => {
                                 const tempValues = selectedSubClassificationValues.map(v => {
                                    if(v.value === subClassificationValue.value){
                                        v.quantity = Number.parseInt(e.target.value, 10);
                                    }
                                    return v;
                                });
                                setSelectedSubClassificationValues(tempValues)
                                }} required/>
                        </Stack>
                    </Stack>
                )) :
                <>
                    <Stack  direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                        <FormLabel><strong>Giá<span style={{color:"red"}}>*</span></strong></FormLabel>
                        <TextField 
                            size='small' value={fCurrency(price)} onChange={(e) => { 
                                const temp = deCodeCurrenry(e.target.value);
                                if(temp > 0)
                                    setPrice(temp)
                            }} required
                        />
                    </Stack>
        
                    <Stack direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                        <FormLabel><strong>Số lượng nhập</strong></FormLabel>
                        <TextField 
                            type="number"
                            InputProps={{
                                inputProps: { 
                                    min: 1 
                                }
                            }}
                            size='small' value={quantity} onChange={(e) => { setQuantity(Number.parseInt(e.target.value, 10) )}}/>
                    </Stack>
                </>
            }
            
            <Stack direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                    <Button onClick={() => {handleAddMoreDetail()}}>Thêm</Button>
                </Stack>
            </Stack>
    )

    const renderDetails = (
        <Stack style={{marginBottom: '10px', borderBottom: '2px dashed black', paddingBottom: '25px'}} direction="Column" alignItems="flexStart" justifyContent="flexStart" >
                {
                    details.map(detail => (
                        <Stack direction='row' alignItems='center'>
                            <Iconify style={{cursor: 'pointer'}} icon="eva:trash-2-outline" sx={{ mr: 2 }} onClick={() => {
                                const tempDetails = details.filter(d => d.productDetailId !== detail.productDetailId);
                                setDetails(tempDetails)
                            }}/>
                            <span>
                                Sản phẩm: {detail.productName} <br/>
                                Số lượng: {detail.quantity} <br />
                                Giá: {detail.price}
                            </span>
                        </Stack>
                    ))
                }
                <br  />
            <span>Tổng sản phẩm: <strong style={{color: 'red'}}>{fCurrency(details.reduce((total, detail) => total + detail.quantity, 0))}</strong></span>
            <span>Tổng tiền: <strong style={{color: 'red'}}>{fCurrency(details.reduce((total, detail) => total + (detail.price * detail.quantity), 0))}đ</strong></span>
            <DialogActions>
                <Button onClick={() => {onFormSubmit({importedAt, details})}}>Lưu</Button>
                <Button color="error" onClick={() => {onClose()}}>Đóng</Button>
            </DialogActions>
        </Stack>
    )

    const handleAddMoreDetail = () => {
        if(!selectedMainClassificationValue || !selectedProduct){
            showErrorMessage('Thêm chi tiết thất bại, vui lòng điền đầy đủ thông tin trước khi thêm');
            return ;
        }

        if(selectedProduct.subClassification){
            console.log(selectedSubClassificationValues)
            if(selectedSubClassificationValues.length <= 0){
                showErrorMessage('Thêm chi tiết thất bại, vui lòng điền đầy đủ thông tin trước khi thêm');
                return;
            }

            const addDetails = selectedSubClassificationValues.map(sub => {
                const productName = `${selectedProduct.name} - ${selectedMainClassificationValue} - ${sub.value}`
    
                const isExisted = details.some(detail => detail.productName === productName);
    
                if(isExisted){
                    showErrorMessage('Sản phẩm bạn vừa thêm đã tồn tại. Nếu bạn muốn chỉnh sửa hãy xóa đi và thêm lại');
                    return null;
                } 

                const productDetail = selectedProduct.details.find(detail => detail.mainClassificationValue === selectedMainClassificationValue && detail.subClassificationValue === sub.value);
                if(!productDetail){
                    showErrorMessage('Thêm chi tiết thất bại'); 
                    return null;
                }
                const tempDetail = {productName, price: sub.price, quantity: sub.quantity, productDetailId: productDetail._id};
                return tempDetail
                
            }).filter(i => i !== null)
    
            setDetails([...details, ...addDetails])   
        } else {
            if(!price || !quantity){
                showErrorMessage('Thêm chi tiết thất bại, vui lòng điền đầy đủ thông tin trước khi thêm');
                return ;
            }

            const productName = `${selectedProduct.name} - ${selectedMainClassificationValue}`;
            const isExisted = details.some(detail => detail.productName === productName);

            if(isExisted){
                showErrorMessage('Sản phẩm bạn vừa thêm đã tồn tại. Nếu bạn muốn chỉnh sửa hãy xóa đi và thêm lại');
                return;
            } 

            const productDetail = selectedProduct.details.find(detail => detail.mainClassificationValue === selectedMainClassificationValue);
            if(!productDetail){
                showErrorMessage('Thêm chi tiết thất bại'); 
                return null;
            }
            const tempDetail = {productName, price, quantity, productDetailId: productDetail._id};
            setDetails([...details, tempDetail]);
        }
    }

    return (     
            <Dialog  open={isShow}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                
                <Box>
                    <DialogTitle style={{textAlign: 'center'}} id="modal-modal-title" variant="h6" component="h2">
                        Thêm đơn nhập hàng 
                    </DialogTitle>
                    <DialogContent>
                        {renderImportedAtInput}
                        {renderDetails}
                        {renderDetailInput}
                    </DialogContent>
                </Box>
        </Dialog>
    )
}

CreateImportWarehouseOrder.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    onFormSubmit: PropTypes.func,
    creatorName: PropTypes.string,
    showErrorMessage: PropTypes.func
}