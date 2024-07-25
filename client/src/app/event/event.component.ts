import { Component } from '@angular/core';
import { LoginsvService } from '../services/loginsv.service';
import { EventModel } from '../models/post.modules';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  showToast: boolean = false;
  toastMessage: string = '';
  events: EventModel[] = [];
  eventIdSource = new BehaviorSubject<number>(0);
  currentEventId = this.eventIdSource.asObservable();
  event: EventModel = new EventModel();
  showForm: boolean = false;
  visible: boolean = false;
  editingEvent: EventModel | null = null; // Sự kiện đang được chỉnh sửa
  constructor(private loginSv: LoginsvService) { }
  role:any ;
  ngOnInit(): void {
    this.role = localStorage.getItem('RoleLogin')
    this.getAllEvents();
  }
  getAllEvents(): void {
    this.loginSv.getAllEvent().subscribe(
        (data) => {
            this.events = data;
        },
        (error) => {
            console.error('Error while fetching events:', error);
        }
    );
  }
  createEvent(): void {
    if (!this.event.eventName || !this.event.firstClosureDate || !this.event.finalClosureDate || !this.event.facultyID) {
      alert('Please fill in all fields before submitting the event.');
      return;
    }
    // Chuyển đổi ngày thành đối tượng Date
    const firstClosureDate = new Date(this.event.firstClosureDate);
    const finalClosureDate = new Date(this.event.finalClosureDate);
    if (finalClosureDate <= firstClosureDate) {
      alert('The final closure date must be after the first closure date.');
      return;
    }
    // Tính toán số ngày giữa hai ngày
    const durationMilliseconds = Math.abs(finalClosureDate.getTime() - firstClosureDate.getTime());
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Số milliseconds trong một ngày
    this.event.durationBetweenClosure = Math.ceil(durationMilliseconds / millisecondsPerDay);
    // Tạo FormData
    const formData = new FormData();
   // formData.append('evenID', this.event.eventID?.toString() ?? '');
    if (this.events.some(event => event.eventName === this.event.eventName)) {
      alert('An event with the same name already exists. Please choose a different name.');
      return;
    }
    formData.append('eventName', this.event.eventName);
    formData.append('firstClosureDate', firstClosureDate.toISOString()); // Chuyển đổi ngày thành chuỗi ISO
    formData.append('finalClosureDate', finalClosureDate.toISOString()); // Chuyển đổi ngày thành chuỗi ISO
    formData.append('durationBetweenClosure', this.event.durationBetweenClosure?.toString() ?? '');
    formData.append('facultyID', this.event.facultyID?.toString() ?? '');
   // console.log(this.event.eventID);
    // Gọi service để tạo sự kiện
    this.loginSv.createEvent(formData).subscribe(
      (response) => {
        console.log('Event created successfully:', response);
        this.showToastMessage('Event created successfully!');
        //this.event.eventID = response.eventID;
      },
      (error) => {
        console.error('Error while creating event:', error);
      }
    );
    // this.event = new  EventModel();
    this.getAllEvents();

  }

  showToastMessage(message: string): void {
    this.showToast = true;
    this.toastMessage = message;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Tắt toast sau 3 giây
  }

  editEvent(event: EventModel): void {
    this.event = { ...event };
    this.editingEvent = event;
    this.visible = true; 
  }  
  
  saveChanges(eventID: number, firstClosureDate: string, finalClosureDate: string): void {
    debugger;
    if (this.editingEvent) {
      // const firstClosureDate = new Date(this.editingEvent.firstClosureDate);
      // const finalClosureDate = new Date(this.editingEvent.finalClosureDate);
       //const durationMilliseconds = Math.abs(finalClosureDate.getTime() - firstClosureDate.getTime());
      // const millisecondsPerDay = 24 * 60 * 60 * 1000; // Số milliseconds trong một ngày
      
      // Gán giá trị cho durationBetweenClosure của editingEvent, không phải của event
      //this.editingEvent.durationBetweenClosure = Math.ceil(durationMilliseconds / millisecondsPerDay);
      
      const formData = new FormData();
      formData.append('EventID', '' + eventID);
      formData.append('EventName', this.editingEvent.eventName);
      console.log(this.editingEvent.eventName);
      formData.append('FirstClosureDate', firstClosureDate);
      formData.append('FinalClosureDate', finalClosureDate);
      formData.append('DurationBetweenClosure', this.editingEvent.durationBetweenClosure?.toString() ?? '');
      formData.append('FacultyID', this.editingEvent.facultyID?.toString() ?? '');
      
      this.loginSv.postEvent(this.editingEvent.eventID, formData).subscribe(
        (response) => {
          console.log('Event updated successfully:', response);
          //this.showToastMessage('Event have been edit');
          this.getAllEvents();
          this.cancelEdit();
        },
        (error) => {
          console.error('Error while updating event:', error);
        }
      );
    }
  }
  
  isEventExpired(event: EventModel): boolean {
    const currentDate = new Date();
    const finalClosureDate = new Date(event.firstClosureDate);
    return currentDate > finalClosureDate;
  }
  cancelEdit(): void {
    this.visible = false; // Đóng dialog chỉnh sửa
    this.event = new EventModel(); // Đặt lại dữ liệu sự kiện
  }

  deleteEvent(id: number): void {
    const result = confirm('Are you sure you want to delete this event?'); // Hiển thị hộp thoại xác nhận
    if (result) {
        // Nếu người dùng nhấp vào OK, gọi service để xóa sự kiện
        this.loginSv.deleteEvent(id).subscribe(
            (response) => {
                console.log('Event deleted successfully:', response);
                this.showToastMessage('Delete event successfully');
                this.getAllEvents(); // Lấy lại danh sách sự kiện sau khi xóa
            },
            (error) => {
                console.error('Error while deleting event:', error);
            }
        );
    }
  }


  toggleForm(): void {
    this.showForm = !this.showForm;
    // Reset các giá trị của form khi form được bật hoặc tắt
    if (!this.showForm) {
      this.event = new EventModel();
    }
  }
  opPost:boolean = false;
  openPost(id: number): void {
    const event = this.events.find(ev => ev.eventID === id);
    if (event) {
      if (this.isEventExpired(event)) {
        alert('Deadline for this event has passed. You cannot post anymore.');
      } else {
        this.opPost = true;
        localStorage.setItem('EventId', '' + id);
      }
    } else {
      console.error('Event not found with ID:', id);
    }
  }  
  opAllPost:boolean =false;
  openAllPost(id: number) {
    this.opAllPost = true;
    const event = this.events.find(ev => ev.eventID === id);
    if (event) {
      localStorage.setItem('FinalClosureDate', event.finalClosureDate);
    }
    // localStorage.setItem('EventIdTogetData', '' + id);
    this.eventIdSource.next(id);
    console.log("id", id)

  }
}
