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

  ngOnChanges(changes: SimpleChanges): void {
    this.calPaginationPerPage(this.localPage, this.localPageSize);
  }

  onChangePageSize(pageSize: number) {
    this.localPageSize = pageSize;
    this.calPaginationPerPage(this.localPage, pageSize);
    this.changePaginate.emit({ page: this.localPage, pageSize });
  }

  onChangePaginate(page: number) {
    this.localPage = page;
    this.calPaginationPerPage(this.localPage, this.localPageSize);
    this.changePaginate.emit({ page, pageSize: this.localPageSize });
  }

  private calPaginationPerPage(page: number, pageSize: number) {
    this.to = pageSize * page - pageSize + 1;
    this.from = pageSize * page - (pageSize - this.totalItemsPerPage);
  }
}
