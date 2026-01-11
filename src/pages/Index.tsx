import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type GameTab = 'games' | 'balance' | 'withdraw' | 'rating' | 'profile' | 'shop' | 'help';

const Index = () => {
  const [activeTab, setActiveTab] = useState<GameTab>('games');
  const [balance, setBalance] = useState({ coins: 10000, paws: 500 });
  const [isSpinning, setIsSpinning] = useState(false);
  const [slotSpinning, setSlotSpinning] = useState(false);
  const [aviatorMultiplier, setAviatorMultiplier] = useState(1.0);
  const [aviatorFlying, setAviatorFlying] = useState(false);

  const spinRoulette = () => {
    if (isSpinning || balance.coins < 100) return;
    setIsSpinning(true);
    setBalance(prev => ({ ...prev, coins: prev.coins - 100 }));
    
    setTimeout(() => {
      const win = Math.random() > 0.5;
      if (win) {
        const winAmount = Math.floor(Math.random() * 500) + 100;
        setBalance(prev => ({ ...prev, coins: prev.coins + winAmount }));
      }
      setIsSpinning(false);
    }, 3000);
  };

  const spinSlots = () => {
    if (slotSpinning || balance.coins < 50) return;
    setSlotSpinning(true);
    setBalance(prev => ({ ...prev, coins: prev.coins - 50 }));
    
    setTimeout(() => {
      const win = Math.random() > 0.6;
      if (win) {
        const winAmount = Math.floor(Math.random() * 300) + 50;
        setBalance(prev => ({ ...prev, coins: prev.coins + winAmount, paws: prev.paws + 5 }));
      }
      setSlotSpinning(false);
    }, 1500);
  };

  const startAviator = () => {
    if (aviatorFlying || balance.coins < 200) return;
    setAviatorFlying(true);
    setBalance(prev => ({ ...prev, coins: prev.coins - 200 }));
    setAviatorMultiplier(1.0);
    
    const interval = setInterval(() => {
      setAviatorMultiplier(prev => {
        const newMultiplier = prev + 0.1;
        if (newMultiplier > 10 || Math.random() > 0.95) {
          clearInterval(interval);
          setAviatorFlying(false);
          return 1.0;
        }
        return newMultiplier;
      });
    }, 100);
  };

  const cashoutAviator = () => {
    if (!aviatorFlying) return;
    setAviatorFlying(false);
    const winAmount = Math.floor(200 * aviatorMultiplier);
    setBalance(prev => ({ ...prev, coins: prev.coins + winAmount, paws: prev.paws + Math.floor(aviatorMultiplier) }));
    setAviatorMultiplier(1.0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20 p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-2 animate-glow">
            🎰 LUCKY PAW
          </h1>
          <p className="text-muted-foreground text-sm">Твоё игровое казино</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 game-card-glow">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💰</span>
              <span className="text-xs text-muted-foreground">Коины</span>
            </div>
            <p className="text-2xl font-bold text-primary">{balance.coins.toLocaleString()}</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🐾</span>
              <span className="text-xs text-muted-foreground">Лапки</span>
            </div>
            <p className="text-2xl font-bold text-secondary">{balance.paws}</p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GameTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-card/50 p-1">
            <TabsTrigger value="games" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Gamepad2" size={18} />
            </TabsTrigger>
            <TabsTrigger value="balance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Wallet" size={18} />
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ShoppingBag" size={18} />
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="User" size={18} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-card to-primary/10 border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      🎡 Рулетка
                    </h3>
                    <p className="text-xs text-muted-foreground">Ставка: 100 коинов</p>
                  </div>
                  <Badge variant="secondary" className="animate-pulse-fast">HOT</Badge>
                </div>
                
                <div className="flex justify-center mb-4">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-5xl ${isSpinning ? 'animate-spin-roulette' : ''}`}>
                    🎯
                  </div>
                </div>
                
                <Button 
                  onClick={spinRoulette} 
                  disabled={isSpinning || balance.coins < 100}
                  className="w-full bg-primary hover:bg-primary/90 text-lg font-bold"
                  size="lg"
                >
                  {isSpinning ? 'Крутится...' : 'Крутить'}
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-secondary/10 border-secondary/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    🎰 Слоты
                  </h3>
                  <p className="text-xs text-muted-foreground">Ставка: 50 коинов</p>
                </div>
                <Badge className="bg-secondary">+5 🐾</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4 bg-background/50 p-4 rounded-lg">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-20 flex items-center justify-center text-4xl bg-card rounded-lg ${slotSpinning ? 'animate-slot-spin' : ''}`}>
                    {['🍒', '🍋', '⭐'][Math.floor(Math.random() * 3)]}
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={spinSlots}
                disabled={slotSpinning || balance.coins < 50}
                className="w-full bg-secondary hover:bg-secondary/90 text-lg font-bold"
                size="lg"
              >
                {slotSpinning ? 'Крутим...' : 'Играть'}
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-accent/10 border-accent/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    ✈️ Авиатор
                  </h3>
                  <p className="text-xs text-muted-foreground">Ставка: 200 коинов</p>
                </div>
                <Badge className="bg-accent">НОВОЕ</Badge>
              </div>
              
              <div className="mb-4 bg-background/50 p-6 rounded-lg text-center">
                <div className={`text-6xl mb-2 ${aviatorFlying ? 'animate-float' : ''}`}>
                  ✈️
                </div>
                <div className="text-4xl font-black text-accent">
                  x{aviatorMultiplier.toFixed(1)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={startAviator}
                  disabled={aviatorFlying || balance.coins < 200}
                  className="bg-accent hover:bg-accent/90 font-bold"
                  size="lg"
                >
                  Взлёт
                </Button>
                <Button 
                  onClick={cashoutAviator}
                  disabled={!aviatorFlying}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent/10 font-bold"
                  size="lg"
                >
                  Забрать
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="TrendingUp" size={24} />
                История транзакций
              </h3>
              <div className="space-y-3">
                {[
                  { type: 'win', game: 'Рулетка', amount: 350, time: '2 мин назад' },
                  { type: 'lose', game: 'Слоты', amount: -50, time: '5 мин назад' },
                  { type: 'win', game: 'Авиатор', amount: 600, time: '10 мин назад' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-semibold">{tx.game}</p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                    <p className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} 💰
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="shop" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="ShoppingCart" size={24} />
                Магазин бонусов
              </h3>
              <div className="grid gap-3">
                {[
                  { icon: '💎', name: '1000 коинов', price: 100, currency: '🐾' },
                  { icon: '🎁', name: 'Бонус x2', price: 50, currency: '🐾' },
                  { icon: '🌟', name: 'Удача +50%', price: 75, currency: '🐾' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <p className="font-semibold">{item.name}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-primary text-primary">
                      {item.price} {item.currency}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-3 flex items-center justify-center text-4xl">
                  🎮
                </div>
                <h3 className="text-2xl font-bold">Игрок #12345</h3>
                <p className="text-muted-foreground">Уровень 15</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground">Всего игр</span>
                  <span className="font-bold">247</span>
                </div>
                <div className="flex justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground">Побед</span>
                  <span className="font-bold text-green-500">134</span>
                </div>
                <div className="flex justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground">Рейтинг</span>
                  <span className="font-bold text-primary">#42</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;