import React, { useState, useEffect } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { View, Text } from 'react-native';

import formatValue from '../../utils/formatValue';
import { useCart } from '../../hooks/cart';
import api from '../../services/api';

import FloatingCart from '../../components/FloatingCart';

import {
  Container,
  ProductContainer,
  ProductImage,
  ProductList,
  Product,
  ProductTitle,
  PriceContainer,
  ProductPrice,
  ProductButton,
} from './styles';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
  inCartItem: boolean;
}

const Dashboard: React.FC = () => {
  const { addToCart, products: inCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // this s the list of db do not actualize on cart refresh..
    async function loadProducts(): Promise<void> {
      const response = await api.get('products');
      setProducts(response.data);
    }

    loadProducts();
  }, []);

  function handleAddToCart(item: Product): void {
    addToCart(item);
  }

  return (
    <Container>
      <ProductContainer>
        <ProductList
          data={products}
          keyExtractor={item => item.id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={({ item }: { item: Product }) => (
            <Product inCartItem={inCart.find(ic => ic.id === item.id)}>
              <ProductImage source={{ uri: item.image_url }} />
              <ProductTitle>{item.title}</ProductTitle>
              <PriceContainer>
                <ProductPrice>{formatValue(item.price)}</ProductPrice>
                <ProductButton
                  testID={`add-to-cart-${item.id}`}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text>{item.quantity}</Text>
                  <FeatherIcon size={20} name="plus-circle" color="#e83f5b" />
                </ProductButton>
              </PriceContainer>
            </Product>
          )}
        />
      </ProductContainer>
      <FloatingCart />
    </Container>
  );
};

export default Dashboard;
