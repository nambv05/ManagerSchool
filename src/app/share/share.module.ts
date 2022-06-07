import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TooltipDirective } from './directives/tooltip.directive';



const components = [
  PaginationComponent,
];

const directives = [
  TooltipDirective,
];

const pipes = [
];

const libraries = [
  CommonModule,

];

@NgModule({
  declarations: [
    components,
    directives,
    pipes,
  ],
  imports: [
    libraries,

  ],
  exports: [
    libraries,
    components,
    directives,
    pipes,
  ],
  providers: [
  ]
})
export class ShareModule {
}
