import { Injectable, Inject, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Subject } from 'rxjs/Subject'

import 'rxjs/add/operator/zip'
import 'rxjs/add/operator/takeUntil'

import { mixin } from './util'

export interface OnRouteActivated {
  route: ActivatedRoute
  onActivatedRoute(params: Params): void
}

export abstract class AbstractComponent implements OnInit, OnDestroy, OnRouteActivated {
  private subscription = new Subject

  abstract route: ActivatedRoute
  abstract onActivatedRoute(params: Params): void

  ngOnInit(): void {
    const routeParams: Params = this.route.params
    const queryParams: Params = this.route.queryParams

    routeParams
      .zip(queryParams, (rp, qp) => {
        return Object.assign(Object.create(null), rp, qp)
      })
      .takeUntil(this.ngOnDestroy)
      .subscribe((p: Params) => {
        this.onActivatedRoute(p)
      })
  }

  ngOnDestroy(): void {
    this.subscription.complete()
  }
}

export function observeRouteActivation<TComponent extends { new(...args: any[]): {} }>(ctr: TComponent) {
  return mixin(ctr, [AbstractComponent])
}
