
export interface OrderDetail {
  id?: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: number;
  customerName: string;
  orderDate: string;
  orderDetails: OrderDetail[];
}
