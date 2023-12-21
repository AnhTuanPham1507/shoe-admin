import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';
import { getEndOfYear, getStartOfYear } from 'src/utils/date-util';

import { orderAPI, statisticAPI } from 'src/api/api-agent';

import AppWebsiteVisits from '../sections/overview/app-website-visits';
import AppWidgetSummary from '../sections/overview/app-widget-summary';
// ----------------------------------------------------------------------

export default function AppPage() {
  const [statistic, setStatistic] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const iniitialData = async () => {
      try {
        const startDateOfYear = getStartOfYear(new Date());
        const endDateOfYear = getEndOfYear(new Date());

        const response = await Promise.all([
          statisticAPI.get(`getBy=year&date=${new Date()}`),
          orderAPI.getAll(`startDate=${startDateOfYear}&endDate=${endDateOfYear}&status=success`)
        ])
        console.log(response)
        setStatistic(response[0].data)
        setOrders(response[1].data.data);
      } catch (error) {
        console.log(error);
      }
    }

    iniitialData();
  }, [])

  return (
    (statistic && orders) ?
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Chào mừng bạn 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={6}>
          <AppWidgetSummary
            title="Tổng doanh thu một năm"
            total={`${fCurrency(orders.reduce((total, order) => total + order.totalPrice, 0))}đ`}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={6}>
          <AppWidgetSummary
            title="số lượng đơn trong một năm"
            total={`${orders.length} đơn`} 
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>


        <Grid xs={12} md={12} lg={12}>
          <AppWebsiteVisits
            title="Tổng thu chi"
            chart={{
              labels: Object.keys(statistic),
              series: [
                {
                  name: 'Tiền đã nhận',
                  type: 'column',
                  fill: 'solid',
                  data: Object.values(statistic).map(item => item.revenue),
                },
                {
                  name: 'Tiền đã chi',
                  type: 'column',
                  fill: 'solid',
                  data: Object.values(statistic).map(item => item.cost),
                },
              ],
            }}
          />
        </Grid>

      </Grid>
    </Container>
    </>: <p>loading</p>
  );
}
