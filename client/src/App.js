import React from 'react';
import './index.css';
import axios from 'axios'
import { FilterOutlined, PlusOutlined, SearchOutlined  } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Card, Upload, Input, Row, Col, Select, InputNumber, Checkbox, Form, Spin, Modal, Button} from 'antd';
import {  FaInstagram, FaLinkedin } from 'react-icons/fa';
import TextArea from 'antd/es/input/TextArea';
import logo from './img/LogoEasyGift.png'

const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;


const App = () => {
  const adress = 'https://easy-gift-ua.pp.ua/api'
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalOpenAddGift, setIsModalOpenAddGift] = React.useState(false);
  const [masEl,editmasEl] = React.useState([])
  const [selectedMenuItem, setSelectedMenuItem] = React.useState("М'ясні");
  const items1 = ["М'ясні", "Солодкі", "Сухофрукти", "З мильними квітами","З живими квітами" ].map((key) => ({
    key,
    label: `${key}`,
  }));
  
  React.useEffect(()=>{
      axios.get(adress+'/gift')
      .then(function (response) {
        editmasEl(response.data) 
         })
      
  },[])
 
  
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModalAddGift = () => {
    setIsModalOpenAddGift(true);
  };
  const handleOkAddGift = () => {
    setIsModalOpenAddGift(false);
  };
  const handleCancelAddGift = () => {
    setIsModalOpenAddGift(false);
  };


  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
  };
  const masCard = masEl.filter(c=>c.type===selectedMenuItem).map(c=><CardElement adress={adress} gift={c}/>)
  return (
    <Layout style={{ minHeight: '100vh' }}>  
    
          <Header style={{ background: '#fff', margin: '16px', padding: '0 16px', display: 'flex', alignItems: 'center',height: '10%', justifyContent: 'space-between', background: 'transparent' }}>
     
            <div style={{ display: 'flex', alignItems: 'center', marginLeft:'5%' }}>
                <img src={logo} alt="Logo" style={{ height: '35%', width: '35%', zIndex:'100' }} />
                <span style={{ fontSize: 'clamp(16px, 2vw, 24px)',  fontWeight: 'bold', padding:'0',margin:'0',lineHeight: '1.1' }}> Майстерня смачних подарунків 
                  <br/> Easy.Gift.UA </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginRight:'5%' }}>
              <FilterOutlined onClick={showModal} style={{fontSize:'25px',marginRight:'10px'}}/>
              <Search
                placeholder="Пошук..."
                enterButton={<SearchOutlined />}
                size= {window.innerWidth <= 768 ? "small" : "large"}
                style={{  maxWidth:'400px', width: '25vw', marginRight:'8%',fontSize:'clamp(16px, 2vw, 24px)' }}
              />
             
            </div>
              
          </Header>

          <Content style={{ margin: '16px', padding: '16px', background: '#fff' }} >
              <div style={{ display: 'flex',justifyContent: 'center', marginBottom: '16px',marginTop:'1%', width:'100%' }}> 
                <Menu mode="horizontal" defaultSelectedKeys={["М'ясні"]} onClick={handleMenuClick} items={items1} style={{ borderBottom: 'none', display: 'flex', width:'100%',justifyContent: 'center', fontSize: 'clamp(10px, 2vw, 18px)' }} /> 
                
              </div>
              <div style={{display:'flex', justifyContent:'end', marginLeft:'8%' }}>
                  <Button type="primary" onClick={showModalAddGift}>Добавити подарунок</Button>
              </div>
              
              <div  style={{marginLeft:'15%',marginRight:'15%', marginTop:'7%'}}>  
                  <Row gutter={[26, 26]}>
                        {masCard.map((card, index) => (
                          <Col  key={index}  xs={8} sm={8} md={10} lg={10} xl={6}>
                              {card}
                          </Col>
                        ))}
                  </Row> 
              </div>

              <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <FilterBlock/>
              </Modal>
              
              <Modal open={isModalOpenAddGift} footer={null}  onCancel={handleCancelAddGift}>
                    <AddGift adress={adress}/>
              </Modal>
          </Content>

          <Footer style={{ position: 'fixed',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            background: '#f1f1f1',
                            padding: '10px 0',
                            textAlign: 'center',
                            boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)' }} >
                  <div>
                    <div style={{display:'flex', justifyContent:'center', marginTop: '0 8px' }}>
                      <p style={{ margin: '0 8px' }}>Номер телефона: <a href="tel:+380973811386">(097)-38-11-386</a></p>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ margin: '0 7px' }}>
                        <FaInstagram size={24} />
                      </a>
                    </div>
                  </div>
          </Footer>

    </Layout>
  );
};

const CardElement = (props) => {
  let [loading, editloading] = React.useState(true)
  let [printerImg,editprinterImg] = React.useState('')
  
  React.useEffect(()=>{ 
      if(props.gift.img!==undefined && props.gift.img!=='' ) {
        axios.get(props.adress+'/imgfoto/'+props.gift.img, {responseType: "arraybuffer"})
        .then(function (response) {
           editprinterImg(URL.createObjectURL(new Blob([response.data],  {type:'image/png'})))
           })
      }
      setTimeout(() => {
        editloading(false); 
      }, 300); 
    
  },[props])
  return <Card hoverable style={{border:'none', textAlign:'center'}}
         cover={loading===true ? <Spin size="large" /> :  <img alt="example" src={printerImg}  />} >
             
             <span style={{fontSize: 'clamp(6px, 1vw, 24px)', lineHeight: '0.8',fontWeight:'800'}}>{props.gift.name} </span> <br/>
             <span style={{fontSize: 'clamp(6px, 1vw, 24px)', lineHeight: '0.8', }}> Вартість: {props.gift.price} грн </span>
              
            
          </Card>
} 

const FilterBlock = () => {

  // Стан для вибраної категорії
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  
  // Стан для цінового діапазону
  const [priceRange, setPriceRange] = React.useState([0, 500]);
  
  // Стан для вибраних додаткових характеристик
  const [selectedExtras, setSelectedExtras] = React.useState([]);

  // Локальна функція для обробки зміни категорії
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  // Локальна функція для обробки зміни мінімальної ціни
  const handleMinPriceChange = (value) => {
    setPriceRange([value || 0, priceRange[1]]);
  };

  // Локальна функція для обробки зміни максимальної ціни
  const handleMaxPriceChange = (value) => {
    setPriceRange([priceRange[0], value || 500]);
  };

  // Локальна функція для обробки вибору додаткових характеристик
  const handleExtrasChange = (checkedValues) => {
    setSelectedExtras(checkedValues);
  };

  // Переконайтеся, що priceRange є масивом з двома числами
  const safePriceRange = Array.isArray(priceRange) && priceRange.length === 2 ? priceRange : [0, 500];

  return (
    <div style={{ padding: '16px', background: '#f7f7f7', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
    

      <div style={{ marginBottom: '16px' }}>
        <h4>Який привід?</h4>
        <Select
          value={selectedCategory}  
          onChange={handleCategoryChange}
          style={{ width: '100%' }}
        >
          <Option value="All">Не вибрано </Option>
          <Option value="Category 1">Перший дзвоник</Option>
          <Option value="Category 3">День захисника</Option>
          <Option value="Category 1">День закоханих</Option>
          <Option value="Category 1">8 березня</Option>
          <Option value="Category 2">День матері</Option>
          <Option value="Category 4">День батька</Option>
          <Option value="Category 4">День народження</Option>
        </Select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4>Вартість</h4>
        <InputNumber
          placeholder="Min Price"
          value={safePriceRange[0]}
          onChange={value => handleMinPriceChange([value || 0, safePriceRange[1]])}
          style={{ width: '48%', marginRight: '4%' }}
        />
        <InputNumber
          placeholder="Max Price"
          value={safePriceRange[1]}
          onChange={value => handleMaxPriceChange([safePriceRange[0], value || 500])}
          style={{ width: '48%' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4>Для кого?</h4>
        <Checkbox.Group
          options={['Чоловіка', 'Жінки', 'Дитини']}
          value={selectedExtras}
          onChange={handleExtrasChange}
        />
      </div>
    </div>
  );
};

const AddGift =(props)=>{
  const [form] = Form.useForm();
  const onFinish = (values) => {
      let objValue= {
        name: values.name, 
        price : values.price,
        opis: values.opis,
        img:values.img.file.name,
        category: values.category,
        type:values.type,
        from_gift: values.from_gift,
          }
 
      axios.post(props.adress+'/addgift', objValue)
      form.resetFields();
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }
  return (

 <Form
            form={form}
            name="basic"
            labelCol={{
            span: 8,
            }}
            wrapperCol={{
            span: 20,
            }}
            initialValues={{
            remember: false,
            }}
            layout="vertical"
            style={{ marginTop: '30px' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
    >
        <Form.Item name="name"  label="Назва">
            <Input />
        </Form.Item>    
        <Form.Item name="price"  label="Ціна">
            <Input />
        </Form.Item>   
        <Form.Item name="opis"  label="Опис">
            <TextArea />
        </Form.Item>   
        <Form.Item name="category"  label="Привід?">
              <Select mode="tags">
                    <Select.Option key={1} value="All">Не вибрано </Select.Option>
                    <Select.Option key={2} value="Перший дзвоник">Перший дзвоник</Select.Option>
                    <Select.Option key={3} value="День захисника">День захисника</Select.Option>
                    <Select.Option key={4} value="День закоханих">День закоханих</Select.Option>
                    <Select.Option key={5} value="8 березня">8 березня</Select.Option>
                    <Select.Option key={6} value="День матері">День матері</Select.Option>
                    <Select.Option key={7} value="День батька">День батька</Select.Option>
                    <Select.Option key={8} value="День народження">День народження</Select.Option>
              </Select>
        </Form.Item>  
        <Form.Item   name="type"   label="Тип" > 
                <Select mode="tags">
                            <Select.Option key={1}  value="М'ясні"> М'ясні</Select.Option>
                            <Select.Option key={2}  value="Солодкі"> Солодкі </Select.Option>
                            <Select.Option key={3}  value="Сухофрукти"> Сухофрукти </Select.Option>
                            <Select.Option key={4}  value="З мильними квітами"> З мильними квітами </Select.Option>
                            <Select.Option key={5}  value="З живими квітами"> З живими квітами</Select.Option>
                </Select>
        </Form.Item>
        <Form.Item name="from_gift"  label="Для кого">
                <Select mode="tags">
                            <Select.Option key={1}  value="Чоловіка"> Чоловіка</Select.Option>
                            <Select.Option key={2}  value="Жінки"> Жінки </Select.Option>
                            <Select.Option key={3}  value="Дитини"> Дитини </Select.Option>
                </Select>
        </Form.Item> 
        <Form.Item    label="Фото" name="img">
            <Upload name="avatar" listType="picture-card" className="avatar-uploader" data={(res)=>{
                }} action={props.adress+"/newimg"}>
                <PlusOutlined />
            </Upload>
        </Form.Item>
        <Form.Item >
                <Button type="primary" htmlType="submit">Добавити</Button>
        </Form.Item>
    </Form>

   
  )
}
export default App;