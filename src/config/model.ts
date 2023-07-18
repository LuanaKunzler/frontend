export interface Carausel {
    title: string;
    text: string;
    imageUrl: string;
  }
  
  export interface Configuration {
    apiUrl: string;
    apiAdmin: string;
    carausel: Array<Carausel>;
    bannerUrl: string;
  }
  