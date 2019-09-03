import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { FormItemProps } from 'antd/es/form/FormItem';
import { FormProps as FormPropsAntd } from 'antd/es/form/Form';
import { Form, Icon, Input as InputAntd } from 'antd';
import AutoBind from './AutoBind';
import FormItem from './FormItem';

export type value = any;
export interface FormProps<T> extends FormPropsAntd {}
export type FormItemProps = FormItemProps;

function injectProps<T>(
  _children: React.ReactElement,
  form: FormComponentProps['form'],
  key: number
): React.ReactElement {
  const { children } = _children.props;

  if (_children.type === Form.Item) {
    return content({ form: form, children }) as React.ReactElement;
  } else if (isDOMElement(_children)) {
    return React.cloneElement(
      _children,
      {
        key,
      },
      children ? content({ form: form, children }) : undefined
    );
  }
  return React.cloneElement(
    _children,
    {
      key,
      form: form,
    },
    children ? content({ form: form, children }) : undefined
  );
}

function childrenDealer<T>(
  children: React.ReactElement,
  props: FormComponentProps & React.PropsWithChildren<T>,
  index: number
) {
  const { form, ...other } = props;

  // form组件函数
  if (
    children &&
    (children as React.ReactElement).type === Form.Item &&
    (children as React.ReactElement).type === Form
  ) {
    return children;
  }
  // 函数节点
  if (typeof children === 'function') {
    return funcCompDealer(
      props,
      children as (props: FormComponentProps) => React.ReactElement,
      index
    );
  }
  // 原生节点
  if (isDOMElement(children)) {
    // console.log(children);
    return injectProps(children as React.ReactElement, form, index);
  }
  // AutoBind
  if (
    React.isValidElement(children) &&
    (children as React.ReactElement).type === AutoBind
  ) {
    return (
      <Form.Item
        key={index}
        {...propsDealer({ ...(children as React.ReactElement).props, form })}
      >
        {/* {injectProps(children, form, index)} */}
        {(children as any).type({
          ...(children as React.ReactElement).props,
          form,
        })}
      </Form.Item>
    );
  }
  // 单个有效子节点
  if (React.isValidElement(children)) {
    return injectProps(children, form, index);
  }
  // 其他类型
  return children;
}

export function content<T, P>(
  props: FormProps<T> & FormComponentProps & React.PropsWithChildren<P>
): React.ReactNodeArray | undefined | React.ReactNode {
  const { children } = props;
  if (children === undefined) {
    return;
  } else if ((children as any).constructor === Array) {
    return (children as Array<React.ReactElement>).map((item, index) =>
      childrenDealer(item, props, index)
    );
  } else {
    return childrenDealer(children as React.ReactElement, props, 0);
  }
}

/**
 * @param {Object} element (P)react element
 * @return {Boolean} whether it's a DOM element
 */
function isDOMElement(element: any) {
  return typeof element.type === 'string';
}

function funcCompDealer(
  formProps: FormComponentProps,
  selfDefinedComponent: (props: FormComponentProps) => React.ReactElement,
  key: number
): React.ReactElement {
  return React.cloneElement(selfDefinedComponent({ ...formProps }), { key });
}

export function componentFormBind(
  component: React.ReactElement,
  form: FormComponentProps
) {
  const { props } = component;
  const keys = Object.keys(props);
  const newProps = {} as any;

  for (const key of keys) {
    if (React.isValidElement(props[key])) {
      newProps[key] = componentFormBind(props[key], form);
    } else if (typeof props[key] === 'function') {
      funcCompDealer(
        form,
        props[key] as (props: FormComponentProps) => React.ReactElement,
        0
      );
    }
  }

  newProps.form = form;
  return React.cloneElement(component, newProps);
}

function propsDealer<T, P>(
  props: FormProps<T> & FormComponentProps & React.PropsWithChildren<P>
) {
  const {
    name,
    form: { getFieldError, isFieldTouched },
  } = props;

  if (name !== undefined) {
    return {
      ...props,
      validateStatus:
        isFieldTouched(name) && getFieldError(name) ? 'error' : '',
      help: (isFieldTouched(name) && getFieldError(name)) || '',
    };
  }
  return {
    ...props,
  };
}
