import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { GlobalDataService } from 'src/app/services/global-data.service';
import {PageSize, PagingConfig} from '../../../configs/paging-config';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() totalRecords = 0;
  @Input() selectedPage = null;
  @Input() pageSize = PagingConfig.PageLimit;
  @Input() selectSearchMode = false;
  @Output() changePage = new EventEmitter<number>();
  @Output() changePageSize = new EventEmitter<number>();

  pageSizeList = PageSize;

  pager: {
    currentPage?: number,
    totalPages?: number,
    pages?: Array<number>,
  } = {
    currentPage: 1,
  };

  constructor(private globalDataService: GlobalDataService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedPage?.currentValue) {
      this.setPage(this.selectedPage);
    }
    if (changes.totalRecords?.currentValue) {
      this.setPage(this.selectedPage);
    }
  }

  get pageInfo(): string {
    const startRecord = (this.pageSize * (this.selectedPage - 1)) + 1;
    const endRecordTheory = this.pageSize * this.selectedPage;
    const endRecord = endRecordTheory > this.totalRecords ? this.totalRecords : endRecordTheory;

    return `(${startRecord} - ${endRecord} / ${this.totalRecords})`;
  }

  setPageSize(size: number): void {
    if (this.pageSize !== size) {
      if (this.selectSearchMode) {
        this.pageSize = size;
        this.pager = this._getPager(Math.ceil(this.totalRecords / this.pageSize), 1);
        this.changePageSize.emit(size);
      } else {
        this.globalDataService.checkFormChange('pagination set page size').subscribe((allowChange) => {
          if (allowChange) {
            this.pageSize = size;
            this.pager = this._getPager(Math.ceil(this.totalRecords / this.pageSize), 1);
            this.changePageSize.emit(size);
          }
        });
      }
    }
  }

  selectPage(page: number, pageSize?: number): void {
    if (this.selectSearchMode) {
      this.setPage(page);
    } else {
      this.globalDataService.checkFormChange('pagination select page').subscribe((allowChange) => {
        if (allowChange) {
          this.setPage(page);
        }
      });
    }
  }

  setPage(page: number, pageSize?: number): void {
    if (pageSize) {
      this.pageSize = pageSize;
    }
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (page < PagingConfig.FirstPage || page > totalPages) {
      return;
    }

    if (this.pager.currentPage !== page && this.selectedPage !== page) {
      this.changePage.emit(page);
    }
    if (totalPages) {
      this.pager = this._getPager(totalPages, page);
    }
  }

  private _getPager(totalPages: number, currentPage: number = 1): {
    currentPage: number;
    totalPages: number;
    pages: Array<number>;
  } {
    let startPage: number;
    let endPage: number;

    if (totalPages <= PagingConfig.PageShow) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= (Math.floor(PagingConfig.PageShow / 2) + 1)) {
      startPage = 1;
      endPage = PagingConfig.PageShow;
    } else if (currentPage >= totalPages - Math.floor(PagingConfig.PageShow / 2)) {
      startPage = totalPages - (PagingConfig.PageShow - 1);
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(PagingConfig.PageShow / 2);
      endPage = currentPage + Math.floor(PagingConfig.PageShow / 2);
    }

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from({length: endPage - startPage + 1}, (x, i) => i + startPage);

    // return object with all pager properties required by the view
    return {
      currentPage,
      totalPages,
      pages
    };
  }
}

