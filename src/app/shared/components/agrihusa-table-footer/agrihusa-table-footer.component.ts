import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

export type IChangePaginate = {
  page: number;
  pageSize: number;
};

export const initialPagination: IChangePaginate = {
  page: 1,
  pageSize: 10
};

@Component({
  selector: 'table-footer-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './agrihusa-table-footer.component.html',
  styleUrls: ['./agrihusa-table-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFooterPaginationComponent implements OnChanges {
  @Input() totalItems = 0;
  @Input() pageSize = initialPagination.pageSize;
  @Input() page = initialPagination.page;
  @Input() totalItemsPerPage = 0;

  @Output() changePaginate = new EventEmitter<IChangePaginate>();

  localPage = this.page;
  localPageSize = this.pageSize;

  pageSizes = [10, 25, 100];
  to = 1;
  from = this.pageSize;

  ngOnChanges(_changes: SimpleChanges): void {
    this.localPage = this.page;
    this.localPageSize = this.pageSize;

    this.calPaginationPerPage(
      this.localPage,
      this.localPageSize
    );
  }

  onChangePageSize(pageSize: number): void {
    this.localPage = 1;
    this.localPageSize = pageSize;

    this.calPaginationPerPage(
      this.localPage,
      this.localPageSize
    );

    this.changePaginate.emit({
      page: 1,
      pageSize
    });
  }

  onChangePaginate(page: number): void {
    this.localPage = page;

    this.calPaginationPerPage(
      this.localPage,
      this.localPageSize
    );

    this.changePaginate.emit({
      page,
      pageSize: this.localPageSize
    });
  }

  private calPaginationPerPage(
    page: number,
    pageSize: number
  ): void {
    this.to = pageSize * page - pageSize + 1;
    this.from =
      pageSize * page -
      (pageSize - this.totalItemsPerPage);
  }
}
