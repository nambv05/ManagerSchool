import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

export type Placement = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input('appTooltip') tooltipTitle: string;
  @Input() placement: Placement = 'top';
  @Input() color = 'info';
  @Input() offset = 0;
  @Input() appTooltipType = 'text';
  tooltipInner: any;
  tooltip: any;
  arrow: any;

  // Distance between host element and tooltip element
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    this.show();
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.hide();
  }

  @HostListener('click', ['$event']) onMouseClick(): void {
    this.hide();
  }

  @HostListener('document:keyup.enter', ['$event']) onKeydownHandler(): void {
    this.hide();
  }

  private _translateText(key: string): string {
    if (key) {
      const translate = this.translate.instant(key);
      return translate !== key ? translate : key;
    }
    return key;
  }


  show(): void {
    if (!this.tooltip && this._translateText(this.tooltipTitle)) {
      this.create();
      this.renderer.addClass(this.tooltip, 'tooltip');
      this.renderer.addClass(this.tooltip, 'fade');
      this.setPosition();
    }
  }

  hide(): void {
    const element = document.getElementsByClassName('ng-tooltip');
    if (this.tooltip) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }
    if (element) {
      for (let i = 0; i <= element.length; i++) {
        if (element[i]) {
          element[i].remove();
        }
      }
    }
  }

  create(): void {
    this.tooltip = this.renderer.createElement('div');
    this.tooltipInner = this.renderer.createElement('div');
    this.arrow = this.renderer.createElement('div');
    this.renderer.addClass(this.arrow, 'arrow');
    this.renderer.addClass(this.tooltipInner, 'tooltip-inner');
    if(this.appTooltipType == 'text'){
      this.tooltipInner.innerHTML = this._translateText(this.tooltipTitle);
    }else{
      const tag_id = "tooltip_"+this.tooltipTitle;
    }

    this.renderer.appendChild(this.tooltip, this.arrow);
    this.renderer.appendChild(this.tooltip, this.tooltipInner);

    this.renderer.appendChild(document.body, this.tooltip);

    // color and position setting
    this.renderer.addClass(this.tooltip, 'show');
    this.renderer.addClass(this.tooltip, 'tooltip-' + this.color);
    this.renderer.setAttribute(this.tooltip, 'data-popper-placement', this.placement);
    this.renderer.addClass(this.tooltip, this.tooltipPlacementClass(this.placement));
  }

  tooltipPlacementClass(placement: string): string {
    let placeClass = 'bs-tooltip-';
    switch (placement) {
      case 'right':
        return placeClass += 'end';
      case 'left':
        return placeClass += 'start';
      default:
        return placeClass += placement;
    }
  }

  setPosition(): void {
    // Host element size and position information
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    // tooltip element size and position information
    const tooltipPos = this.tooltip.getBoundingClientRect();

    // window scroll top
    // The getBoundingClientRect method returns a relative position in the viewport.
    // When scrolling occurs, the vertical scroll coordinate value should be reflected on the top of the tooltip element.
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top;
    let left;

    if (this.placement === 'top') {
      top = hostPos.top - tooltipPos.height - this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'bottom') {
      top = hostPos.bottom + this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    if (this.placement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - this.offset;
    }

    if (this.placement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + this.offset;
    }

    // Move down if there is not enough space to show the tooltip
    top = top - 2;
    if (top < 0) {
      this.placement = 'bottom';
      this.renderer.removeAttribute(this.tooltip, 'data-popper-placement');
      this.renderer.setAttribute(this.tooltip, 'data-popper-placement', this.placement);
    }

    // When scrolling occurs, the vertical scroll coordinate value should be reflected on the top of the tooltip element.
    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
