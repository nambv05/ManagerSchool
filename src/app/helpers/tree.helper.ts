import {JobBomModel} from '../models/job.model';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class TreeHelper {
  constructor() {
  }
  // convert array to tree
  convertJob(array, parentProduct, flag = false, parent?, tree?): Array<any> {
    tree = typeof tree !== 'undefined' ? tree : [];
    parent = typeof parent !== 'undefined' ? parent : { productCode: parentProduct };

    const children = array.filter((e) => e.parentProductCode === parent.productCode);
    children.sort((a, b) => (a.productCode < b.productCode) ? 1 : ((b.productCode < a.productCode) ? -1 : 0));

    if (children.length > 0) {
      if ( parent.productCode === parentProduct ){
        tree = children;
      }else{
        if (flag && (parent.procurementClassification === 'PURCHASE_WHOLE' || parent.procurementClassification === 'PROVIDED')) {
          parent['childBomResult'] = [];
          return ;
        }
        parent['childBomResult'] = children;
      }
      children.forEach((c) => {
        this.convertJob( array, parentProduct, flag, c );
      });
    } else {
      parent['childBomResult'] = [];
    }
    return tree;
  }

  mapJob(array, arrayInfo): Array<JobBomModel> {
    return array.map((v) => {
      const parentProductCode = v.parentProductCode;
      const procurementClassification = v.procurementClassification;
      const requiredQuantity = v.requiredQuantity;
      const vendorCode = v.vendorCode;
      const vendorName = v.vendorName;
      v = Object.assign({}, arrayInfo.find(item => item.productCode === v.childProductCode));
      v['parentProductCode'] = parentProductCode;
      v['procurementClassification'] = procurementClassification;
      v['requiredQuantity'] = requiredQuantity;
      v['vendorCode'] = vendorCode;
      v['vendorName'] = vendorName;
      return v;
    });
  }
}
