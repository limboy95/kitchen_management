import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { 
  Plus, 
  Search, 
  Calendar, 
  Package, 
  Trash2, 
  AlertTriangle,
  X
} from 'lucide-react';
import { FridgeItem } from '../types';

const commonIngredients = [
  { name: 'Melk', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'liter' },
  { name: 'Brood', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Eieren', image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Kaas', image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Boter', image: 'https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Yoghurt', image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Appels', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Bananen', image: 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Tomaten', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Uien', image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Aardappelen', image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'kg' },
  { name: 'Wortelen', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Paprika', image: 'https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Komkommer', image: 'https://images.pexels.com/photos/37528/cucumber-salad-food-healthy-37528.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Kip', image: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Gehakt', image: 'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Vis', image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Rijst', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Pasta', image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Olijfolie', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Sla', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Courgette', image: 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Champignons', image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Citroen', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' }
  
  // Vlees & Vis
  { name: 'Zalm', image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Tonijn', image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Garnalen', image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Rundvlees', image: 'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Varkensvlees', image: 'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Spek', image: 'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Worst', image: 'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Ham', image: 'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  
  // Zuivel
  { name: 'Mozzarella', image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Parmezaan', image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Feta', image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Roomkaas', image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Slagroom', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Crème fraîche', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Kwark', image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  
  // Groenten
  { name: 'Broccoli', image: 'https://images.pexels.com/photos/47347/broccoli-vegetable-food-healthy-47347.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Bloemkool', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Spinazie', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Rucola', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'IJsbergsla', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Aubergine', image: 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Rode paprika', image: 'https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Gele paprika', image: 'https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Rode ui', image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Sjalot', image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Knoflook', image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Gember', image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Prei', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Selderij', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Radijs', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Rode biet', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Venkel', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Asperges', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Mais', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Erwten', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Bonen', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  
  // Fruit
  { name: 'Sinaasappel', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Limoen', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Peer', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Druiven', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Aardbeien', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Blauwe bessen', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Frambozen', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Mango', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Ananas', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Kiwi', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Avocado', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  
  // Granen & Pasta
  { name: 'Spaghetti', image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Penne', image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Fusilli', image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Basmati rijst', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Jasmijn rijst', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Quinoa', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Couscous', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Bulgur', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Havermout', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Meel', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Volkoren brood', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Wit brood', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  
  // Kruiden & Specerijen
  { name: 'Basilicum', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Peterselie', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Koriander', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Dille', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Tijm', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Rozemarijn', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Oregano', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Munt', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  
  // Oliën & Azijnen
  { name: 'Zonnebloemolie', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Kokosolie', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Sesamolie', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Balsamico azijn', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Witte wijnazijn', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Appelazijn', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  
  // Noten & Zaden
  { name: 'Amandelen', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Walnoten', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Pijnboompitten', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Zonnebloempitten', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Pompoenpitten', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Sesamzaad', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Chiazaad', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Lijnzaad', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  
  // Conserven & Gedroogd
  { name: 'Tomaten in blik', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'blik' },
  { name: 'Kikkererwten', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'blik' },
  { name: 'Zwarte bonen', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'blik' },
  { name: 'Linzen', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Gedroogde tomaten', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Olijven', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Kappertjes', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  
  // Sauzen & Condimenten
  { name: 'Sojasaus', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Vissaus', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Hoisinsaus', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Sriracha', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Mayonaise', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Mosterd', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Ketchup', image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Tomatenpuree', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Kokosmelk', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'ml' },
  { name: 'Bouillon', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'blokjes' },
  
  // Diepvries
  { name: 'Diepvries erwten', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Diepvries spinazie', image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Diepvries bessen', image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  { name: 'Diepvries garnalen', image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'gram' },
  
  // Bakkerij
  { name: 'Croissants', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Bagels', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Pita brood', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  { name: 'Tortilla wraps', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'stuks' },
  
  // Dranken
  { name: 'Sinaasappelsap', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'liter' },
  { name: 'Appelsap', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'liter' },
  { name: 'Witte wijn', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'fles' },
  { name: 'Rode wijn', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'fles' },
  { name: 'Bier', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=150', unit: 'fles' }
];

export const Fridge: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    fetchFridgeItems();
  }, [user]);

  const fetchFridgeItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching fridge items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!user || !selectedIngredient) return;

    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .insert([
          {
            user_id: user.id,
            name: selectedIngredient.name,
            quantity: quantity,
            unit: selectedIngredient.unit,
            expiry_date: expiryDate || null,
            image_url: selectedIngredient.image
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setItems([data, ...items]);
      setSelectedIngredient(null);
      setQuantity(1);
      setExpiryDate('');
      setShowAddForm(false);
      setIngredientSearch('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fridge_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIngredients = commonIngredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mijn Koelkast</h1>
            <p className="mt-2 text-gray-600">
              Beheer uw ingrediënten en voorraad
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Toevoegen</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek ingrediënten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Add Item Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ingrediënt Toevoegen
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedIngredient(null);
                    setIngredientSearch('');
                    setQuantity(1);
                    setExpiryDate('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {!selectedIngredient ? (
                <>
                  {/* Search ingredients */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Zoek ingrediënten..."
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Ingredient grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {filteredIngredients.map((ingredient) => (
                      <button
                        key={ingredient.name}
                        onClick={() => setSelectedIngredient(ingredient)}
                        className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                      >
                        <img
                          src={ingredient.image}
                          alt={ingredient.name}
                          className="w-16 h-16 object-cover rounded-lg mb-2"
                        />
                        <span className="text-xs text-center text-gray-700 font-medium">
                          {ingredient.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Selected ingredient details */}
                  <div className="flex items-center mb-6 p-4 bg-orange-50 rounded-lg">
                    <img
                      src={selectedIngredient.image}
                      alt={selectedIngredient.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {selectedIngredient.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Eenheid: {selectedIngredient.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedIngredient(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Quantity and expiry */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aantal ({selectedIngredient.unit})
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Houdbaarheidsdatum (optioneel)
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setSelectedIngredient(null)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Terug
                      </button>
                      <button
                        onClick={handleAddItem}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                      >
                        Toevoegen
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Fridge Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Geen ingrediënten gevonden
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Probeer een andere zoekterm' : 'Voeg uw eerste ingrediënt toe om te beginnen'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Eerste ingrediënt toevoegen
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-sm border p-4 transition-all hover:shadow-md ${
                  isExpired(item.expiry_date || '') ? 'border-red-300 bg-red-50' :
                  isExpiringSoon(item.expiry_date || '') ? 'border-yellow-300 bg-yellow-50' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-start mb-3">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg mr-3"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {item.expiry_date && (
                  <div className={`flex items-center space-x-2 text-sm ${
                    isExpired(item.expiry_date) ? 'text-red-600' :
                    isExpiringSoon(item.expiry_date) ? 'text-yellow-600' :
                    'text-gray-500'
                  }`}>
                    {(isExpired(item.expiry_date) || isExpiringSoon(item.expiry_date)) && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <Calendar className="h-4 w-4" />
                    <span>
                      {isExpired(item.expiry_date) ? 'Verlopen op' :
                       isExpiringSoon(item.expiry_date) ? 'Verloopt op' :
                       'Houdbaar tot'} {new Date(item.expiry_date).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};