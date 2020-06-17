import {
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { RouteOptions } from '../oauth.interface';
import { getLength } from './getLength';

export function applyMethodDecorator(
  decorator: (...args: any) => MethodDecorator,
  value: any,
  target: Record<any, any>,
  property: string,
) {
  decorator(value)(
    target,
    property,
    Object.getOwnPropertyDescriptor(target.prototype, property),
  );
}

export function checkOptions(
  options: RouteOptions,
  target: Record<any, any>,
  property: string,
) {
  if (getLength(options.guards)) {
    applyMethodDecorator(UseGuards, options.guards, target, property);
  }
  if (getLength(options.interceptors)) {
    applyMethodDecorator(
      UseInterceptors,
      options.interceptors,
      target,
      property,
    );
  }
  if (getLength(options.pipes)) {
    applyMethodDecorator(UsePipes, options.pipes, target, property);
  }
  if (getLength(options.filters)) {
    applyMethodDecorator(UseFilters, options.filters, target, property);
  }
  if (getLength(options.decorators)) {
    options.decorators.forEach((decorator) => {
      decorator(
        target,
        property,
        Object.getOwnPropertyDescriptor(target.prototype, property),
      );
    });
  }
}
