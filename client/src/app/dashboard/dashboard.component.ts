import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LoginsvService } from '../services/loginsv.service';
import { Chart, ChartOptions, LinearScale, TimeScale, TimeSeriesScale } from 'chart.js'; // Import các loại Scale từ 'chart.js'
import * as pluginDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  contributionsByFaculty: any[] = [];
  contributionsByStudent: any[] = [];
  @ViewChild('pieChartCanvas') private pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChartCanvas') private barChartCanvas!: ElementRef<HTMLCanvasElement>; 
  @ViewChild('lineChartCanvas') private lineChartCanvas!: ElementRef<HTMLCanvasElement>; 
  private pieChartContext!: CanvasRenderingContext2D;
  private barChartContext!: CanvasRenderingContext2D;
  private lineChartContext!: CanvasRenderingContext2D;
  showTable: boolean = false; // Biến để điều khiển sự hiển thị của bảng

  // Các phương thức và hàm khác

  toggleTable(): void {
    this.showTable = !this.showTable;
  }

  constructor(private loginsvService: LoginsvService) { }

  ngOnInit(): void {
    this.getDashboardContributionsByFaculty();
    this.getDashboardContributionsByStudent();
  }

  fileName = "ExcelSheet.xlsx"
  exportExcel(): void {
    this.loginsvService.exportDashboardStatisticsAsExcel().subscribe(data => {
      // Create a URL for the Excel file blob
      const url = window.URL.createObjectURL(data);
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName;
      // Programmatically click the anchor to initiate download
      a.click();
      // Cleanup: remove the temporary anchor and revoke the URL object
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error exporting dashboard statistics:', error);
    });
  }

  ngAfterViewInit(): void {
    if (this.pieChartCanvas && this.pieChartCanvas.nativeElement) {
      const canvasElement: HTMLCanvasElement = this.pieChartCanvas.nativeElement;
      this.pieChartContext = canvasElement.getContext('2d')!;
    }
    if (this.barChartCanvas && this.barChartCanvas.nativeElement) {
      const canvasElement: HTMLCanvasElement = this.barChartCanvas.nativeElement;
      this.barChartContext = canvasElement.getContext('2d')!;
    }
    if (this.lineChartCanvas && this.lineChartCanvas.nativeElement) {
      const canvasElement: HTMLCanvasElement = this.lineChartCanvas.nativeElement;
      this.lineChartContext = canvasElement.getContext('2d')!;
    }
    //this.exportExcel();
  }

  getDashboardContributionsByFaculty(): void {
    this.loginsvService.getDashboardContributionsByFaculty().subscribe(
      data => {
        this.contributionsByFaculty = data;
        console.log(this.contributionsByFaculty);
        this.renderPieChart();
        this.renderBarChart(); // Gọi hàm renderBarChart sau khi nhận dữ liệu
      },
      error => {
        console.error('Error retrieving contributions by faculty:', error);
      }
    );
  }

  getDashboardContributionsByStudent(): void {
    this.loginsvService.getDashboardContributionsByStudent().subscribe(
      data => {
        this.contributionsByStudent = data; // Store data for contributions by student
        console.log(this.contributionsByStudent);
        this.renderLineChart(); // Call the method to render line chart
      },
      error => {
        console.error('Error retrieving contributions by student:', error);
      }
    );
  }

  renderBarChart(): void {
    if (!this.contributionsByFaculty.length) return;
  
    const labels = this.contributionsByFaculty.map(item => item.facultyName);
    const data = this.contributionsByFaculty.map(item => item.numberOfContributions);
    
    new Chart(this.barChartContext, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Contributions',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)', // Màu nền cột
          borderColor: 'rgba(54, 162, 235, 1)', // Màu viền cột
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 1,
        scales: {
          y: { // Sử dụng scale linear cho trục y
            beginAtZero: true
          },
          x: { // Sử dụng scale linear cho trục x
            stacked: true
          }
        },
        plugins: {
          datalabels: {
            formatter: (value: number) => value
          }
        }
      }
    });
  }

  renderPieChart(): void {
    if (!this.contributionsByFaculty.length) return;
  
    const totalContributions = this.contributionsByFaculty.reduce((acc, curr) => acc + curr.numberOfContributions, 0);
    
    const labels = this.contributionsByFaculty.map(item => item.facultyName);
    const percentages = this.contributionsByFaculty.map(item => (item.numberOfContributions / totalContributions) * 100);
    
    new Chart(this.pieChartContext, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: percentages,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ]
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 1,
        plugins: {
          datalabels: {
            formatter: (value: number) => value.toFixed(2) + '%' 
          }
        }
      }
    });
  }

  renderLineChart(): void {
    if (!this.contributionsByStudent.length) return;
    console.log(this.contributionsByStudent);
  
    // Extracting data for the line chart
    const labels: string[] = [];
    const data: number[] = [];
  
    this.contributionsByStudent.forEach(student => {
      student.facultyContributions.forEach((facultyContributions: any) => { // Sử dụng any cho contribution
        labels.push(facultyContributions.numberOfContributions);
        data.push(facultyContributions.numberOfContributors);
      });
    });
  
    new Chart(this.lineChartContext, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Contributions by Student',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 1
      }
    });
  }  
  calculatePercentage(contributions: number): number {
    const totalContributions = this.contributionsByFaculty.reduce((acc, curr) => acc + curr.numberOfContributions, 0);
    return Math.round((contributions / totalContributions) * 100);
  }
}
