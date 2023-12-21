import { useSelector } from 'react-redux';
import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes, useNavigate } from 'react-router-dom';

import OrderPage from 'src/pages/order';
import BannerPage from 'src/pages/banner';
import PartnerPage from 'src/pages/partner';
import CategoryPage from 'src/pages/category';
import DashboardLayout from 'src/layouts/dashboard';
import ProductDetailPage from 'src/pages/product-detail';
import SeasonalCategoryPage from 'src/pages/seasonal-category';
import ImportWarehouseOrderPage from 'src/pages/import-warehouse-order';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const CreateProductPage = lazy(() => import('src/pages/create-product'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const token = useSelector(state => state.token?.value);
  const nav = useNavigate();

  useEffect(() => {
    if(!token) nav('login')
  }, [token, nav])

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet  />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'category', element: <CategoryPage /> },
        { path: 'partner', element: <PartnerPage /> },
        { path: 'import-warehouse-order', element: <ImportWarehouseOrderPage /> },
        { path: 'order', element: <OrderPage /> },
        { path: 'seasonal-category', element: <SeasonalCategoryPage /> },
        { path: 'banner', element: <BannerPage /> },
        { 
          path: 'products', 
          element: (<Outlet />), 
          children: [
            { element: <ProductsPage style={{backgroundColor: 'red'}} />, index: true },
            { path: 'create', element: <CreateProductPage />},
            { path: ':slug', element: <ProductDetailPage />}
          ]
        },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    
  
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    }
  ]);

  return routes;
}
