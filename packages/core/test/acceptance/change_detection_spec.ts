/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {ApplicationRef, Component, Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {expect} from '@angular/platform-browser/testing/src/matchers';

describe('change detection', () => {

  describe('embedded views', () => {

    @Directive({selector: '[viewManipulation]', exportAs: 'vm'})
    class ViewManipulation {
      constructor(
          private _tplRef: TemplateRef<{}>, private _vcRef: ViewContainerRef,
          private _appRef: ApplicationRef) {}

      insertIntoVcRef() { this._vcRef.createEmbeddedView(this._tplRef); }

      insertIntoAppRef(): EmbeddedViewRef<{}> {
        const viewRef = this._tplRef.createEmbeddedView({});
        this._appRef.attachView(viewRef);
        return viewRef;
      }
    }

    @Component({
      selector: 'test-cmp',
      template: `
        <ng-template #vm="vm" viewManipulation>{{'change-detected'}}</ng-template>
      `
    })
    class TestCmpt {
    }

    beforeEach(() => {
      TestBed.configureTestingModule({declarations: [TestCmpt, ViewManipulation]});
    });

    it('should detect changes for embedded views inserted through ViewContainerRef', () => {
      const fixture = TestBed.createComponent(TestCmpt);
      const vm = fixture.debugElement.childNodes[0].references['vm'] as ViewManipulation;

      vm.insertIntoVcRef();
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveText('change-detected');
    });

    it('should detect changes for embedded views attached to ApplicationRef', () => {
      const fixture = TestBed.createComponent(TestCmpt);
      const vm = fixture.debugElement.childNodes[0].references['vm'] as ViewManipulation;

      const viewRef = vm.insertIntoAppRef();

      // A newly created view was attached to the CD tree via ApplicationRef so should be also
      // change detected when ticking root component
      fixture.detectChanges();

      expect(viewRef.rootNodes[0]).toHaveText('change-detected');
    });

  });

});