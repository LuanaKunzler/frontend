import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { BookService } from 'src/app/services/book.service';
import { BookResponse, Orders } from 'src/app/store/model';
import { OrdersService } from 'src/app/services/admin-services/orders.service';
import { UsersService } from 'src/app/services/admin-services/users.service';
import 'chartjs-plugin-datalabels';
import { getLocaleDate } from 'src/utils/date';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  mostSellingProducts: BookResponse[] = [];
  recentOrders: Orders[] = [];
  totalOrdersElements = 0;
  totalUsersElements = 0;
  totalSalesAmount = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private bookService: BookService,
    private orderService: OrdersService,
    private userService: UsersService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.createMostSellingChart();
    this.createSalesByMonthChart();
    this.getRecentOrders();
    this.createTotalRevenueByMonthChart();
    this.getOrders();
    this.getUsers();
    this.getTotalSalesAmount();
  }

  getOrders(): void {
    const sortDirection = 'desc';
    const sortField = 'date';

    this.orderService
      .getOrders(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((orders) => {
        this.totalOrdersElements = orders.totalElements;
      });
  }

  getUsers(): void {
    const sortDirection = 'desc';
    const sortField = 'registrationDate';
    this.userService
      .getUsers(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((users) => {
        this.totalUsersElements = users.totalElements;
      });
  }

  getTotalSalesAmount(): void {
    this.orderService
      .getTotalSalesAmount()
      .subscribe((totalAmount) => {
        this.totalSalesAmount = totalAmount;
      });
  }

  getRecentOrders() {
    this.orderService.getRecentOrders().subscribe(
      (result) => {
        this.recentOrders = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  createMostSellingChart() {
    this.bookService.getMostSelling().subscribe((data) => {
      const labels = data.map((book) => book.title);
      const sellCounts = data.map((book) => book.sellCount);
  
      const canvas = document.getElementById(
        'mostSellingChart'
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
  
      if (!ctx) {
        console.error('Não foi possível obter o contexto 2D do canvas.');
        return;
      }
  
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Mais vendidos',
              data: sellCounts,
              backgroundColor: '#673ab7',
              borderColor: '#673ab7',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    });
  }
  

  createSalesByMonthChart() {
    const year = new Date().getFullYear();
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    const observables = months.map((month, index) =>
      this.orderService.getBooksSoldByMonth(year, index + 1)
    );

    forkJoin(observables).subscribe((results: number[]) => {
      const canvas = document.getElementById(
        'salesByMonthChart'
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Não foi possível obter o contexto 2D do canvas.');
        return;
      }

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Vendas por Mês',
              data: results,
              backgroundColor: 'rgba(54, 162, 235, 1)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 3,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    });
  }

  createTotalRevenueByMonthChart() {
    const year = new Date().getFullYear();
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    const observables = months.map((month, index) =>
      this.orderService.getTotalRevenueByMonth(year, index + 1)
    );

    forkJoin(observables).subscribe((results: number[]) => {
      const canvas = document.getElementById(
        'revenueChart'
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Não foi possível obter o contexto 2D do canvas.');
        return;
      }

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: months,
          datasets: [
            {
              data: results,
              backgroundColor: [
                '#FFFF00',
                '#FFAE42',
                '#9ACD32',
                '#0000FF',
                '#191970',
                '#8A8AE5',
                '#7A0600',
                '#FF0000',
                '#FF6961',
                '#FF5CAD',
                '#F5C0CF',
                '#FBC00E',
              ],
              borderColor: '#fff',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: {
                generateLabels: (chart: any) => {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label: any, index: number) => {
                      const dataset = data.datasets[0];
                      const value = dataset.data[index];
                      const sum = dataset.data.reduce(
                        (a: number, b: number) => a + b,
                        0
                      );
                      const percentage = ((value * 100) / sum).toFixed(2) + '%';
                      return {
                        text: `${label} (${percentage})`,
                        fillStyle: dataset.backgroundColor[index],
                        hidden: false,
                        index: index,
                        datasetIndex: 0,
                      };
                    });
                  }
                  return [];
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  let sum = 0;
                  const dataArr = context.chart.data.datasets[0].data;
                  dataArr.forEach((data: number) => {
                    sum += data;
                  });
                  const value = context.raw;
                  const percentage = ((value * 100) / sum).toFixed(2) + '%';
                  return `${value} (${percentage})`;
                },
              },
            },
          },
        },
      });
    });
  }

  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      in_preparation: 'Preparando',
      sent: 'Enviado',
      finished: 'Finalizado',
      canceled: 'Cancelado',
    };

    if (status && statusMap[status.toLowerCase()]) {
      return statusMap[status.toLowerCase()];
    }
    return '';
  }

  getStatusClass(status: string): string {
    if (status === 'FINISHED') {
      return 'status finished';
    } else if (status === 'SENT') {
      return 'status sent';
    } else if (status === 'IN_PREPARATION') {
      return 'status inPreparation';
    } else if (status === 'CANCELED') {
      return 'status canceled';
    }
    return '';
  }

  convertDate(date: number) {
    return getLocaleDate(date);
  }
}
