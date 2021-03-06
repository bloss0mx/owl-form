import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  CSSProperties,
} from 'react';
import { Form as FormAntd, Input as InputAntd, Row, Col } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import moment, { Moment } from 'moment';
import { useDrag, useDrop } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import Login from './Login';
import Input from './Input';
import InputNumber from './InputNumber';
import DmForm, {
  fieldIniter,
  // field2Obj,
  // obj2Field,
  // list,
  beforeUseForm,
  useFormState,
  useFormComponent,
  useOneStep,
  // formSort,
  // setFormItem,
  // rmFormItem,
  // insertToForm,
} from './DmForm';
import Base from './Base';
import Submit from './Submit';
import CheckBox from './CheckBox';
import FormItem from './FormItem';
import DatePicker from './DatePicker';
import AutoBind from './AutoBind';
import Select from './Select';
import Radio from './Radio';
import TimePicker from './TimePicker';
import NoReRender from './NoReRender';
import Button from 'antd/es/button';

export {
  Login,
  Input,
  InputNumber,
  DmForm,
  Submit,
  CheckBox,
  FormItem,
  DatePicker,
  // AutoBind,
  Select,
  Radio,
  TimePicker,
  NoReRender,
  //
  fieldIniter,
  // field2Obj,
  // obj2Field,
};

// console.log(Input instanceof Base);

const validator = (rule: object, value: string, callback: Function) => {
  if (value.match(/\s/g)) callback('空字符无效');
  if (value.length < 6) callback('密码长度不能小于6个字符');
  const d = value.match(/\d/g);
  const ll = value.match(/[a-z]/g);
  const gl = value.match(/[A-Z]/g);
  const clear = value.replace(/[\d\sa-zA-Z]/g, '');
  if (d && ll && gl && clear.length) {
    callback();
  } else callback('密码需要包含大写字母、小写字母、数字、符号');
};

export default class HorizontalLoginForm extends React.Component<any, any> {
  render() {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '8px' }}>
        <OneStepForm />
      </div>
    );
  }
}

const ItemTypes = {
  CARD: 'card',
};

let dragBeginIndex: any;

function setDragBeginIndex(index: number) {
  dragBeginIndex = index;
}

const randomPwd = () => Math.floor(Math.random() * 10e15).toString(36);

/**
 * OneStepForm
 */
function OneStepForm() {
  const {
    formData,
    setFormData,
    MyForm,
    handleFormChange,
    fieldName,
    sortForm,
    insertToArray,
    removeItem,
    setItem,
  } = useOneStep(
    {
      captcha: '我是自定义组件',
      captcha2: { name: '我是内嵌布局' },
      text: 'something000@123.com',
      text2: 'anyother@yoo.com',
      yo: '我也是',
      list: ' '
        .repeat(5)
        .split('')
        .map((_, index) => `${12 - index}`)
        // .sort((a: string, b: string) => parseInt(a) - parseInt(b))
        .map(item => 'lPhone ' + item + ''),
      a: [{ b: 'str' }],
      listWithObj: ' '
        .repeat(0)
        .split('')
        .map((_, index) => ({
          name: 'Wawei P' + (3 - index) * 10,
          password: randomPwd() + randomPwd(),
        })),
    },
    (data: any) => {
      console.log(data);
    }
  );

  const list = fieldName.list || [];
  const listWithObj = fieldName.listWithObj || [];

  const afterSort = (before: number, after: number) => {
    sortForm(list, before, after);
  };

  const afterSort2 = (before: number, after: number) => {
    sortForm(listWithObj, before, after);
  };

  // console.log(fieldName);

  const addAfter = (index: number) => {
    const len = (fieldName.listWithObj && fieldName.listWithObj.length) || 0;
    console.log(fieldName.listWithObj, index);
    insertToArray(fieldName.listWithObj, index + 1, {
      name: '双倍快乐' + len,
      password: 'cola',
    });
  };

  const rmField = (index: number) => {
    removeItem(fieldName.listWithObj[index]);
  };

  const rmCaptcha = () => {
    removeItem(fieldName.captcha);
  };

  const rmCaptcha2 = () => {
    removeItem(fieldName.captcha2.name);
  };

  console.warn(fieldName, formData);

  return (
    <MyForm onChange={handleFormChange} {...formData} formData={formData}>
      <Input name="text" label="text" type="email" extra={'加个extra会怎样'} />
      <Input
        name="text2"
        label="text2"
        type="email"
        extra={'加个extra会怎样'}
      />
      <h3>以下红框部分是可以拖动的</h3>
      <DndProvider backend={HTML5Backend}>
        {list.map((item: string, index: number) => (
          <Card item={item} index={index} key={item} afterSort={afterSort} />
        ))}
      </DndProvider>
      <h2>双倍快乐</h2>
      <a onClick={() => addAfter(0)}>add</a>
      <DndProvider backend={HTML5Backend}>
        {listWithObj.map((item: string, index: number) => (
          <DoubleCard
            item={item}
            index={index}
            key={index}
            addAfter={addAfter}
            rmField={rmField}
            afterSort={afterSort2}
          />
        ))}
      </DndProvider>
      <Input name="yo" label="yo" />
      {fieldName['captcha'] && (
        <div>
          {({ form: { getFieldDecorator } }: FormComponentProps) => (
            <FormAntd.Item label={'自定义组件'}>
              <Row gutter={8}>
                <Col span={14}>
                  {getFieldDecorator('captcha', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input the captcha you got!',
                      },
                    ],
                  })(<InputAntd />)}
                </Col>
                <Col span={10}>
                  <Button onClick={() => rmCaptcha()}>rm captcha</Button>
                </Col>
              </Row>
            </FormAntd.Item>
          )}
        </div>
      )}
      {fieldName['captcha2'] && (
        <FormItem label="内嵌布局">
          <Row gutter={8}>
            <Col span={14}>
              <Input
                name={fieldName['captcha2'] && fieldName['captcha2']['name']}
                rules={[
                  {
                    required: true,
                    message: 'Please input the captcha you got!',
                  },
                ]}
              />
            </Col>
            <Col span={10}>
              <Button onClick={() => rmCaptcha2()}>Get captcha</Button>
            </Col>
          </Row>
        </FormItem>
      )}
      {/* <Button onClick={addField}>add</Button>
      &nbsp;&nbsp;
      <Button onClick={rmField}>rm</Button> */}
      <Submit name="submit" />
    </MyForm>
  );
}

function Card(props: { item: any; index: any; afterSort: any }) {
  const { item, index, afterSort, ...other } = props;

  const [{ isDragging }, drag, ConnectDragPreview] = useDrag({
    item: { type: ItemTypes.CARD },
    begin: () => {
      setDragBeginIndex(index);
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: () => {
      if (
        dragBeginIndex !== undefined &&
        index !== undefined &&
        dragBeginIndex !== index
      ) {
        afterSort(dragBeginIndex, index);
      }
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });

  return ConnectDragPreview(
    <div
      ref={drop}
      style={{
        position: 'relative',
        border: '1px solid red',
        marginBottom: '8px',
        padding: '8px',
      }}
    >
      <span
        ref={drag}
        style={{
          display: 'inline-block',
          position: 'absolute',
          zIndex: 99,
          left: '0px',
          top: '0px',
        }}
      >
        三
      </span>
      <Input key={item} name={item} label={index + 1 + '等奖'} {...other} />
    </div>
  );
}

function DoubleCard(props: {
  item: any;
  index: any;
  afterSort: any;
  addAfter: any;
  rmField: any;
}) {
  const { item, index, afterSort, addAfter, rmField, ...other } = props;

  const [{ isDragging }, drag, ConnectDragPreview] = useDrag({
    item: { type: ItemTypes.CARD },
    begin: () => {
      setDragBeginIndex(index);
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: () => {
      if (
        dragBeginIndex !== undefined &&
        index !== undefined &&
        dragBeginIndex !== index
      ) {
        afterSort(dragBeginIndex, index);
      }
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });

  // console.log(item);

  const style = {
    display: 'inline-block',
    position: 'absolute',
    zIndex: 99,
    left: '4px',
  } as CSSProperties;

  return ConnectDragPreview(
    <div
      ref={drop}
      style={{
        position: 'relative',
        border: '1px solid red',
        marginBottom: '8px',
        padding: '8px',
      }}
    >
      <span
        ref={drag}
        style={{
          ...style,
          top: '0px',
        }}
      >
        三
      </span>
      <span
        onClick={() => addAfter(index)}
        style={{ ...style, cursor: 'pointer', top: '20px' }}
      >
        add
      </span>
      <span
        onClick={() => rmField(index)}
        style={{ ...style, cursor: 'pointer', top: '40px' }}
      >
        rm
      </span>
      <Input
        key={item.name}
        name={item.name}
        label={index + 1 + '等奖'}
        {...other}
      />
      <Input
        key={item.password}
        name={item.password}
        label={'密码'}
        {...other}
      />
    </div>
  );
}

//////
//////
//////
//////

// export const ARRAY_SEPARATOR = '[';
// export const OBJECT_SEPARATOR = '{';
// export const INDEX_NAME = '__idx__';

// const store: any = {};
// const origin = { a: { d: 'x', e: [1, 3, 5] }, b: [1, 2, 3], c: 'w' };
// const index = toIndexed(origin, store);
// console.log('index', index, index.a[INDEX_NAME]);
// console.log(origin, store);
// console.error('>>>>>>>>>>>>>>>>>>>>>>>');
// console.log(toStore(index, store));

// let obj = {

//   get index(){
//   },

// }

// console.error('-----------------------');
// console.log('排序测试');
// const store1 = {};
// const origin1 = { arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] };
// const index1 = toIndexed(origin1, store1);
// const _index1 = {
//   arr: index1.arr.sort((a: any, b: any) => b[INDEX_NAME] - a[INDEX_NAME]),
// };
// console.log(index1.arr, _index1.arr, origin1.arr, toStore(_index1, store1).arr);
// console.log('排序用索引');

// console.error('=======================');
// console.log('修改数据');
// const store2 = {};
// const origin2 = { arr: [4, 2, 1, 3] };
// const index2 = toIndexed(origin2, store2);
// changeStore(index2, ['arr', 2], store2, 5);
// console.log(toStore(index2, store2));

// console.error('<<<<<<<<<<<<<<<<<<<<<<<');

// const store3 = {};
// const origin3 = { arr: [4, 2, 1, 3] };
// const index3 = toIndexed(origin3, store3);
