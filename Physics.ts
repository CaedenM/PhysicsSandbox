type Vector2D = {
    x : number,
    y : number
};

type Circle = {
    radius : number,
    center : Vector2D
};

type Polygon2D = {
    vertices : Array<Vector2D>
};

export class VectorOperations2D {
    public static negate(v : Vector2D) : Vector2D {
        return {
            x : -v.x,
            y : -v.y
        };
    }

    public static subtract(v0 : Vector2D, v1 : Vector2D) : Vector2D {
        return {
            x : v0.x - v1.x,
            y : v0.y - v1.y
        };
    }

    public static add(v0 : Vector2D, v1 : Vector2D) : Vector2D {
        return {
            x : v0.x + v1.x,
            y : v0.y + v1.y
        };
    }

    public static memberwiseMultiply(v0 : Vector2D, v1 : Vector2D) : Vector2D {
        return {
            x : v0.x * v1.x,
            y : v0.y * v1.y
        };
    }

    public static memberwiseDivide(v0 : Vector2D, v1 : Vector2D) : Vector2D {
        return  {
            x : v0.x / v1.x,
            y : v0.y / v1.y
        };
    }

    public static scaleUp(v : Vector2D, scalar : number) : Vector2D {
        return {
            x : v.x * scalar,
            y : v.y * scalar
        };
    }

    public static scaleDown(v : Vector2D, scalar : number) : Vector2D {
        return VectorOperations2D.scaleUp(v, 1.0 / scalar);
    }

    public static crossProduct2D(v0 : Vector2D, v1 : Vector2D) : number {
        // |[i j k]|
        // |[v0.x v0.y v0.z]|.z == <v0.y * v1.z - v0.z * v1.y, -(v0.x * v1.z - v0.z * v1.x), v0.x * v1.y - v0.y * v1.x>.z
        // |[v1.x v1.y v1.z]|
        return v0.x * v1.y - v0.y * v1.x;
    }

    public static orthogonalize(v : Vector2D) : Vector2D {
        return {
            x : -v.y,
            y : v.x
        };
    }

    public static magnitudeSquared(v : Vector2D) : number {
        return VectorOperations2D.dotProduct(v, v);
    }

    public static magnitude(v : Vector2D) : number {
        return Math.sqrt(VectorOperations2D.magnitudeSquared(v));
    }

    public static normalize(v : Vector2D) : Vector2D {
        return VectorOperations2D.scaleDown(v, VectorOperations2D.magnitude(v));
    }

    public static dotProduct(v0 : Vector2D, v1 : Vector2D) : number {
        return v0.x * v1.x + v0.y * v1.y;
    }
}

export class Utils {
    public static copyArray<T>(array : Array<T>) : Array<T> {
        return Utils.transformArray(array, (t : T) => Object.assign({}, t));
    }

    public static transformArray<T>(array : Array<T>, transformHelper : (t : T) => T) : Array<T> {
        let
            copy = new Array<T>(array.length);
        array.forEach(entry => copy.push(transformHelper(entry)));
        return copy;
    }
}

export type RelativeCoordinatesPolygon2D = Polygon2D & Circle;

export class PolygonOperations2D {
    public static getBoundingCircle(vertices : Array<Vector2D>) : Circle {

    }

    public static convertToRelativeCoordinates(p : Polygon2D) : RelativeCoordinatesPolygon2D {
        let
            boundingCircle = PolygonOperations2D.getBoundingCircle(p.vertices),
            relativeCoordinates = Utils.transformArray(p.vertices, (v : Vector2D) => VectorOperations2D.subtract(v, boundingCircle.center));
        return {
            center : boundingCircle.center,
            radius : boundingCircle.radius,
            vertices : relativeCoordinates
        };
    }
}

export interface PhysicsShape extends Circle {
    getVisualization() : SVGElement;
    // Positive rotational speed is anti-clockwise.
    rotationalSpeed : number;
    velocity : Vector2D;
}

export class PhysicsDemo {
    private static shapes : Array<PhysicsShape>;
    private static canvasHTML : HTMLElement;

    public static main(...shapes : Array<PhysicsShape>) : void {
        PhysicsDemo.canvasHTML = <HTMLElement>document.getElementById("canvas");
        PhysicsDemo.shapes = new Array<PhysicsShape>();
        // Clone the input array.
        PhysicsDemo.shapes = Utils.copyArray(shapes);

        PhysicsDemo.shapes.forEach(shape => {
            PhysicsDemo.canvasHTML.appendChild(shape.getVisualization());
        });
    }
}