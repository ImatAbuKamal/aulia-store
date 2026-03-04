export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
};

export type CarouselItem = {
  title: string;
  caption: string;
  imageUrl: string;
  link: string;
};

export type AboutItem = {
  title: string;
  content: string;
  deskripsi?: string;
  text?: string;
};

export type ContactInfo = {
  phone: string;
  telepon?: string;
  email: string;
  address: string;
  alamat?: string;
  mapUrl: string;
  map?: string;
  embedMap?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};
