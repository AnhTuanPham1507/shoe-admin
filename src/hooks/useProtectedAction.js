// import axios from 'axios';
// import { useState , useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// import { protectedAPI } from '../api/ConfigAPI';
// import { setErrorValue } from '../layouts/dashboard/redux/slices/ErrorSlice';

// function useProtectedAction(permissions) {
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const [grantedPermissions, setGrantedPermissions] = useState(null)
//     const { token } = useSelector(state => ({
//             token: state.token.value
//         }))

//     useEffect(() => {
//         async function checkPermissions() {
//             try {
//                 const qPermissions = permissions.reduce((q,item)=> `${q}permissions[]=${item}&`,"")
//                 const res = await protectedAPI.checkAction(token, qPermissions)
//                 setGrantedPermissions(res.data)
//             } catch (error) {
//                 if (axios.isAxiosError(error))
//                     dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
//                 else dispatch(setErrorValue(error.toString()));
//                 navigate("/error")
//             }
//         }
//         checkPermissions()
//     }, [token, permissions])
//     return grantedPermissions
// }

// export default useProtectedAction;