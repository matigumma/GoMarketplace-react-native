import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { ProductContainer } from 'src/pages/Dashboard/styles';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // await AsyncStorage.clear();
      const storedProducts = await AsyncStorage.getItem('@Market:products');
      if (storedProducts) {
        const storageProductList = JSON.parse(storedProducts);
        // console.log('list inside async sto..', storageProductList);
        setProducts(storageProductList);
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    id => {
      /*      // store the product filtered from products state
      const product = products.filter(prod => prod.id === id && prod);
      // store the rest without the product
      const productsWithout = products.filter(prod => prod.id !== id);

      if (product) {
        product[0].quantity
          ? (product[0].quantity += 1)
          : (product[0].quantity = 2);
        console.log(product);
      }
      setProducts([...productsWithout, product[0]]); */
      // await AsyncStorage.setItem(
      //   '@Market:products',
      //   JSON.stringify(products),
      // );
      // }
      // breno:
      // map for change things inside
      // filter to remove
      const inCart = products.map(product => {
        return product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product;
      });
      AsyncStorage.setItem('@GoCart:cart', JSON.stringify(inCart));
      setProducts(inCart);
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      const lookIfIsAlreadyInCart = products.find(
        item => item.id === product.id,
      );
      // console.log('lookIfIsAlreadyInCart', lookIfIsAlreadyInCart)
      if (!lookIfIsAlreadyInCart) {
        // the correct way to do the property add to an object:
        const newProd = { ...product, quantity: 1 };
        // product.quantity = 1;
        setProducts([...products, newProd]);
        await AsyncStorage.setItem(
          '@Market:products',
          JSON.stringify(products),
        );
      } else {
        increment(lookIfIsAlreadyInCart.id);
      }
    },
    [increment, products],
  );

  const decrement = useCallback(
    id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART

      // breno

      const inCart = products.map(product => {
        return product.id === id
          ? {
              ...product,
              quantity: product.quantity - 1 < 1 ? 1 : product.quantity - 1,
            }
          : product;
      });
      // there is an error on tests line 137
      // should be await wait(() => expect(getByText('1')).toBeTruthy());
      AsyncStorage.setItem('@GoCart:cart', JSON.stringify(inCart));
      setProducts(inCart);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
