/* eslint-disable no-unused-vars */
/* eslint-disable perfectionist/sort-imports */
import { Helmet } from 'react-helmet-async';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';


import Iconify from 'src/components/iconify';

import { useState, useEffect } from 'react';
import AleartPopup from 'src/components/alert-popup/alert-popup';
import { Box, Pagination } from '@mui/material';
import { isString } from 'src/utils/validator';
import { blogAPI } from 'src/api/api-agent';
import { AxiosError } from 'axios';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';

import { fDate } from 'src/utils/date-util';

import SvgColor from 'src/components/svg-color';

import CreateBlog from 'src/sections/blog/create-blog';
import UpdateBlog from 'src/sections/blog/update-blog';
import DeleteBanner from 'src/sections/banner/delete-banner';
import avatar from '../../public/assets/images/avatars/avatar_1.jpg'
// ----------------------------------------------------------------------

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [titleMessage, setTitleMessage] = useState(null);
  const [activeMessage, setActiveMessage] = useState(false);
  const [color, setColor] = useState(null);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getInitialData = async () => {
        try {
            const queryParams = `page=${page}&perPage=${5}`;

            const getBlogsRes = await blogAPI.getAll(queryParams);
            const tempBlogs = getBlogsRes.data;
            setBlogs(tempBlogs.data);
            setTotalPage(tempBlogs.totalPage)
        } catch (error) {
            console.log(error);
        }
    }
    getInitialData();
}, [page])

  const handleShowCreateModal = () => {
    setIsShowCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setIsShowCreateModal(false)
  }

  const handleShowUpdateModal = (_activeBlog) => {
    setIsShowUpdateModal(true)
    setActiveBlog(_activeBlog);
  }

  const handleCloseUpdateModal = () => {
    setIsShowUpdateModal(false)
    setActiveBlog(null);
  }

  const handleShowDeleteModal = (_activeBlog) => {
    setIsShowDeleteModal(true)
    setActiveBlog(_activeBlog);
}

const handleCloseDeleteModal = () => {
    setIsShowDeleteModal(false)
    setActiveBlog(null);
}

  const setErrorMessage = (_message) => {
    setTitleMessage('Thao tác thất bại');
    setMessage(_message);
    setColor('red');
    setActiveMessage(true);
    setTimeout(() => {
        setActiveMessage(false)
    }, 3000)
  }

  const setSuccessfulMessage = (_message) => {
    setTitleMessage('Thao tác thành công');
    setMessage(_message);
    setColor('green');
    setActiveMessage(true);
    setTimeout(() => {
        setActiveMessage(false)
    }, 3000)
  }

  const validateCreateFormData = (data) => {
    switch(true){
        case (!isString(data.title)):{
            setErrorMessage('Tiêu đề bài viết không hợp lệ')
            return false;
        }

        case (!isString(data.content)):{
            setErrorMessage('Nội dung không hợp lệ')
            return false;
        }

        case (!isString(data.authorName)):{
            setErrorMessage('Tên tác giả không hợp lệ')
            return false;
        }

        case (!isString(data.shortDescription)):{
          setErrorMessage('Mô tả bài viết không hợp lệ')
          return false;
        }

        default: {return true;}
    }
  }
  
  const handleCreateFormSubmit = async (data) => {
    try {
        if(validateCreateFormData(data)) {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('authorName', data.authorName);
            formData.append('shortDescription', data.shortDescription);
            formData.append('content', data.content);
            formData.append('image', data.image);

            const createBlogRes = await blogAPI.create(
               formData
            );
            const tempBlogs = [...blogs, createBlogRes.data];
            setBlogs(tempBlogs);
            setSuccessfulMessage(`Thêm bài viết thành công, xin cảm ơn `)
            handleCloseCreateModal();
        }       
    } catch (error) {
        setErrorMessage(
            error instanceof AxiosError ? error.response.data.message : `Thêm bài viết thất bại vui lòng thử lại.`
        )
        console.log(error);
    }
}

const validateUpdateFormData = (data) => {
  switch(true){
      case (!isString(data.title, true)):{
          setErrorMessage('Tiêu đề bài viết không hợp lệ')
          return false;
      }

      case (!isString(data.content, true)):{
          setErrorMessage('Nội dung không hợp lệ')
          return false;
      }

      case (!isString(data.authorName, true)):{
          setErrorMessage('Tên tác giả không hợp lệ')
          return false;
      }

      case (!isString(data.shortDescription)):{
        setErrorMessage('Mô tả bài viết không hợp lệ')
        return false;
      }

      default: {return true;}
  }
}

const handleUpdateFormSubmit = async (data) => {
    try {
        if(validateUpdateFormData(data)) {
            const formData = new FormData();
            if(data.title) formData.append('title', data.title);
            if(data.content) formData.append('content', data.content);
            if(data.authorName) formData.append('authorName', data.authorName);
            if(data.image) formData.append('image', data.image);
            if(data.shortDescription)  formData.append('shortDescription', data.shortDescription);
            const updateBlogRes = await blogAPI.update(
               activeBlog._id,
               formData
            );
            const tempBlogs = [...blogs.filter(cate => cate._id !==activeBlog._id), updateBlogRes.data];
            setBlogs(tempBlogs);
            setSuccessfulMessage(`Cập nhật bài viết thành công, xin cảm ơn `)
            handleCloseUpdateModal();
        }       
    } catch (error) {
        setErrorMessage(
            error instanceof AxiosError ? error.response.data.message : `Cập nhật bài viết thất bại vui lòng thử lại.`
        )
        console.log(error);
    }
}

const handleDeleteFormSubmit = async () => {
    try {
         await blogAPI.delete( activeBlog._id );
        const tempBlogs = blogs.filter(cate => cate._id !==activeBlog._id);
        setBlogs(tempBlogs);
        setSuccessfulMessage(`Xóa bài viết thành công, xin cảm ơn `);
        handleCloseDeleteModal();

    } catch (error) {
        setErrorMessage(
            error instanceof AxiosError ? error.response.data.message : `Xóa bài viết thất bại vui lòng thử lại.`
        )
        console.log(error);
    }
}


  const renderBlogCard = (post, index) => {
    const { image, title, authorName, createdAt } = post;

    const latestPostLarge = index === 0;

    const latestPost = index === 1 || index === 2;

    const renderAvatar = (
      <Avatar
        alt={authorName}
        src={avatar}
        sx={{
          zIndex: 9,
          width: 32,
          height: 32,
          position: 'absolute',
          left: (theme) => theme.spacing(3),
          bottom: (theme) => theme.spacing(-2),
          ...((latestPostLarge || latestPost) && {
            zIndex: 9,
            top: 24,
            left: 24,
            width: 40,
            height: 40,
          }),
        }}
      />
    );

    const renderTitle = (
      <Link
        color="inherit"
        variant="subtitle2"
        underline="hover"
        sx={{
          height: 44,
          overflow: 'hidden',
          WebkitLineClamp: 2,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          ...(latestPostLarge && { typography: 'h5', height: 60 }),
          ...((latestPostLarge || latestPost) && {
            color: 'common.white',
          }),
        }}
      >
        {title}
      </Link>
    );

    const renderCover = (
      <Box
        component="img"
        alt={image.name}
        src={image.path}
        sx={{
          top: 0,
          width: 1,
          height: 1,
          objectFit: 'cover',
          position: 'absolute',
        }}
      />
    );

    const renderDate = (
      <Typography
        variant="caption"
        component="div"
        sx={{
          mb: 2,
          color: 'text.disabled',
          ...((latestPostLarge || latestPost) && {
            opacity: 0.48,
            color: 'common.white',
          }),
        }}
      >
        Ngày đăng: {fDate(createdAt)}
      </Typography>
    );

    const renderAuthorName = (
      <Typography
        variant="caption"
        component="div"
        sx={{
          mb: 2,
          color: 'text.disabled',
          ...((latestPostLarge || latestPost) && {
            opacity: 0.48,
            color: 'common.white',
          }),
        }}
      >
        Tên tác giả: {authorName}
      </Typography>
    );

    const renderShape = (
      <SvgColor
        color="paper"
        src="/assets/icons/shape-avatar.svg"
        sx={{
          width: 80,
          height: 36,
          zIndex: 9,
          bottom: -15,
          position: 'absolute',
          color: 'background.paper',
          ...((latestPostLarge || latestPost) && { display: 'none' }),
        }}
      />
    );

    return (
      <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
        <Card>
          <Box
            sx={{
              position: 'relative',
              pt: 'calc(100% * 3 / 4)',
              ...((latestPostLarge || latestPost) && {
                pt: 'calc(100% * 4 / 3)',
                '&:after': {
                  top: 0,
                  content: "''",
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                },
              }),
              ...(latestPostLarge && {
                pt: {
                  xs: 'calc(100% * 4 / 3)',
                  sm: 'calc(100% * 3 / 4.66)',
                },
              }),
            }}
          >
            {renderShape}

            {renderAvatar}

            {renderCover}
          </Box>

          <Box
            sx={{
              p: (theme) => theme.spacing(4, 3, 3, 3),
              ...((latestPostLarge || latestPost) && {
                width: 1,
                bottom: 0,
                position: 'absolute',
              }),
            }}
          >

            {renderTitle}
            {renderAuthorName}
            {renderDate}
            <Stack direction="row">
              <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} color="green" onClick={() => handleShowUpdateModal(post)} />
              <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} color="red" onClick={() => handleShowDeleteModal(post)}/>
            </Stack>
          </Box>
        </Card>
      </Grid>
    );
  }

  return (
    <>
      <Helmet>
        <title> Bài viết </title>
      </Helmet>

      <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Bài viết</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleShowCreateModal()}>
          Tạo bài viết
        </Button>
      </Stack>


      <Grid container spacing={3}>
        {blogs.map((post, index) => (
          renderBlogCard(post, index)
        ))}
      </Grid>

      <Stack alignItems="center" justifyItems="center" >
        <Pagination count={totalPage} siblingCount={3} page={page} onChange={(e, value) => setPage(value)}/>
      </Stack>

       <CreateBlog
            isShow={isShowCreateModal}
            onFormSubmit={handleCreateFormSubmit}
            onClose={handleCloseCreateModal}
        />

        <UpdateBlog
            isShow={isShowUpdateModal}
            onFormSubmit={handleUpdateFormSubmit}
            onClose={handleCloseUpdateModal}
            blog={activeBlog}
        />  

        <DeleteBanner
            banner={activeBlog}
            isShow={isShowDeleteModal}
            onFormSubmit={handleDeleteFormSubmit}
            onClose={handleCloseDeleteModal}
        />

        <AleartPopup message={message} title={titleMessage} isActive={activeMessage} color={color} />
    </Container>
    </>
  );
}
