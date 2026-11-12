export type Product = {
    id: number;
    name: string;
    category: string;
    image: string;
    price: number;
    tag?: string;
    sub?: string;
    demo?: boolean;
};
export type Menu = [
    string,
    string,
    string,
    string
];

