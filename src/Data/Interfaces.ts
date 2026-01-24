export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string | null;
  cart: Cart | null;
  orders: Order[];
  address: string;
  phoneNumber: string;
}
export interface Order {
    id: number;
    user : User;
    products:Iproduct[];
}
export interface Cart{
    user: User;
    products: Iproduct[];
}
export interface Iproduct{
    id: number;
    productName: string;
    quantity: number;
    description: string;
    price: number;
    image: string;
    cart: Cart| null;
    order: Order| null;
}