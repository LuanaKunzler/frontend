export interface GoogleSignInRequest {
  email: string;
  firstName: string;
  lastName: string;
  providerId: string;
  provider: string;
  idToken: string;
}

export interface User {
    id: number;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    country?: string;
    emailVerified: number;
    roles: any[];
    enabled?: boolean;
    socialProvider: string;
    registrationDate: Date;
  }
  
  export interface BookCategory {
    id: number;
    name: string;
  }

  export interface BookCategoryResponse {
    content: BookCategory[];
    totalElements: number;
  }
  
  export interface Book {
    id: number;
    title: string;
    longDesc: string;
    bookCategory: BookCategory;
    author: Author;
    isbn: number;
    bookEdition: string;
    numberOfPages: number;
    language: string;
    imageUrl: string;
    bookUrl: string;
    unitPrice: number;
    cargoPrice: number;
    unitsInStock: number;
    sellCount: number;
    isActive: boolean;
    dateCreated: number;
    bookAuthor: Author;
  }

  export interface BookRequest {
    title: string;
    longDesc: string;
    bookCategory: BookCategory;
    author: Author;
    isbn: string;
    bookEdition: string;
    numberOfPages: number;
    language: string;
    bookUrl: string;
    unitPrice: number;
    unitsInStock: number;
    isActive: boolean;
  }
  
  
  export interface BookResponse {
    id: number;
    title: string;
    imageUrl: string;
    author: Author;
    bookUrl: string;
    unitPrice: number;
    cargoPrice: number;
    sellCount: number;
  }
  
  export interface Author {
    id: number;
    name: string;
  }

  export interface AuthorsResponse {
    content: Author[];
    totalElements: number;
  }
  
  export interface Authors {
    authors: Author[];
  }
  
  export interface CartItem {
    id: number;
    url: string;
    imageUrl: string;
    title: string;
    price: number;
    amount: number;
    unitsInStock: number;
    author: Author;
  }
  
  export interface Discount {
    id: number;
    code: string;
    discountPercent: number;
    status: number;
  }

  export interface DiscountResponse {
    content: Discount[];
    totalElements: number;
  }

  export interface Cart {
    cartItems: Array<CartItem>;
    discount: Discount;
    totalCartPrice: number;
    totalCargoPrice: number;
    totalPrice: number;
  }
  
  export interface Personal {
    shipName: string;
    phone: string;
  }
  
  export interface Shipping {
    shipAddress: string;
    billingAddress: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
  
  export interface Payment {
    cardOwner: string;
    cardNo: string;
    cardExp: {
      month: string;
      year: string;
    };
    cardCCV: string;
  }
  
  export interface Checkout {
    shipName: string;
    shipAddress: string;
    billingAddress: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  }
  
  export interface OrderItems {
    id: number;
    book: Book;
    bookUrl: string;
    title: string;
    price: number;
    cargoPrice: number;
    imageUrl: string;
    amount: number;
    category: BookCategory;
    author: Author;
  }

  export interface OrderDetailList {
    id: number;
    book: Book;
    amount: number;
  }
  
  export interface Orders {
    id: number;
    user: User;
    shipName: string;
    shipAddress: string;
    billingAddress: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    totalPrice: number;
    totalCargoPrice: number;
    date: number;
    shipped: string;
    cargoFirm: string;
    trackingNumber: string;
    discount: Discount;
    orderItems?: Array<OrderItems>;
    orderDetailList?: Array<OrderDetailList>
  }
  
  export interface UserResponse {
    content: User[];
    totalElements: number;
  }

  export interface OrderResponse {
    content: Orders[];
    totalElements: number;
  }

  export interface BookContent {
    content: Book[];
    totalElements: number;
  }

  export interface Showcase {
    newlyAdded: Array<Book>;
    mostSelling: Array<BookResponse>;
    interested: Array<Book>;
  }
  