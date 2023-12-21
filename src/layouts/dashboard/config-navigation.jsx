import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Trang chủ',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Loại sản phẩm',
    path: '/category',
    icon: icon('ic_cart'),
  },
  {
    title: 'Loại sản phẩm theo mùa',
    path: '/seasonal-category',
    icon: icon('ic_cart'),
  },
  {
    title: 'Đối tác',
    path: '/partner',
    icon: icon('ic_cart'),
  },
  {
    title: 'Hình quảng cáo',
    path: '/banner',
    icon: icon('ic_cart'),
  },
  {
    title: 'Đơn nhập hàng',
    path: '/import-warehouse-order',
    icon: icon('ic_cart'),
  },
  {
    title: 'Đơn hàng',
    path: '/order',
    icon: icon('ic_cart'),
  },
  {
    title: 'Sản phẩm',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Bài viết',
    path: '/blog',
    icon: icon('ic_blog'),
  }
];

export default navConfig;
