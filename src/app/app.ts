
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrderService } from './services/order.service';
import { Order } from './models/order.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {

  orders: Order[] = [];
  showForm: boolean = false;
  editMode: boolean = false;

  order: Order = this.emptyOrder();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Empty order object
  emptyOrder(): Order {
    return {
      customerName: '',
      orderDate: '',
      orderDetails: [
        {
          productName: '',
          quantity: 1,
          price: 0
        }
      ]
    };
  }

  // Get all orders
  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  // Open create form
  createOrder(): void {
    this.order = this.emptyOrder();
    this.editMode = false;
    this.showForm = true;
  }

  // Add order detail
  addOrderDetail(): void {
    this.order.orderDetails.push({
      productName: '',
      quantity: 1,
      price: 0
    });
  }

  // Remove order detail
  removeOrderDetail(index: number): void {
    if (this.order.orderDetails.length > 1) {
      this.order.orderDetails.splice(index, 1);
    }
  }

  // Save or Update order
  saveOrder(): void {

    if (!this.order.customerName || !this.order.orderDate) {
      alert('Please enter customer name and order date');
      return;
    }

    if (this.editMode && this.order.id) {

      this.orderService.updateOrder(this.order.id, this.order)
        .subscribe({
          next: () => {
            alert('Order updated successfully');
            this.cancelForm();
            this.loadOrders();
          },
          error: (error: any) => {
            console.error('Update error:', error);
            alert('Unable to update order');
          }
        });

    } else {

      this.orderService.saveOrder(this.order).subscribe({
        next: () => {
          alert('Order saved successfully');
          this.cancelForm();
          this.loadOrders();
        },
        error: (error: any) => {
          console.error('Save error:', error);
          alert('Unable to save order');
        }
      });

    }
  }

  // Edit order
  editOrder(item: Order): void {
    this.order = {
      ...item,
      orderDetails: item.orderDetails.map(detail => ({ ...detail }))
    };

    this.editMode = true;
    this.showForm = true;
  }

  // Cancel form
  cancelForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.order = this.emptyOrder();
  }

  // Delete order
  deleteOrder(id: number): void {

    if (confirm('Are you sure you want to delete this order?')) {

      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          alert('Order deleted successfully');
          this.loadOrders();
        },
        error: (error: any) => {
          console.error('Delete error:', error);
          alert('Unable to delete order');
        }
      });

    }
  }
}
